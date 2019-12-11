const BaseService = require('./BaseService');
const User = require('../models/User');
const OptionalInfo = require('../models/OptionalInfo');
const fs = require('fs');
const { cloudinary } = require('../config/cloudinaryConfig');
const { removeNullProperty } = require('../helpers/removeNullProperty');
const { userInfoValidation, optionalInfoValidation } = require('../validations/updateUsersProfile');
const { getUserInfo } = require('../helpers/authHelper');
const stripe = require('stripe')('sk_test_B4Tn8un5MCv2LSkhlJ2ls4Qk');

class ProfileService extends BaseService {
  constructor() {
    super(ProfileService);
  }

  async fetchUserInfo(id) {
    try {
      const userInfo = await getUserInfo(id);
      return super.returnResponse(200, { userInfo });
    } catch (error) {
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }

  async deactivateUserAccount(id) {
    try {
      await User.update({ deactivated: true }, { where: { id } });
      return super.returnResponse(200, {});
    } catch (error) {
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }

  async updateUserInfo(file, { userInfo, optionalInfo, cardInfo }, userId, email) {
    userInfo = JSON.parse(userInfo);
    optionalInfo = JSON.parse(optionalInfo);
    console.log('TCL: ProfileService -> updateUserInfo -> optionalInfo', optionalInfo)
    cardInfo = JSON.parse(cardInfo);
    try {
      // const cardToken = await stripe.tokens.create({
      //   card: {
      //     name: cardInfo.cardName,
      //     number: cardInfo.cardNumber,
      //     exp_month: cardInfo.month,
      //     exp_year: cardInfo.year,
      //     cvc: cardInfo.cvc
      //   }
      // });
      const { errors, isValid, optionalInfoId, currentUser } = await userInfoValidation(
        userInfo,
        email
      );
      if (!isValid) {
        file && file.path && fs.unlinkSync(file.path);
        return super.returnResponse(403, errors);
      }
      if (file && file.path) {
        const { secure_url } = await cloudinary.uploader.upload(file.path, {
          public_id: `user-${userId}`
        });
        userInfo.photo = secure_url;
        fs.unlinkSync(file.path);
      } else {
        userInfo.photo = currentUser.photo;
      }
      const userOptionalInfo = await OptionalInfo.findOne({ where: { id: optionalInfoId } });
      optionalInfoValidation(optionalInfo, userOptionalInfo);

      userInfo.dateOfBirth = new Date(userInfo.dateOfBirth);
      userInfo.dateOfBirth.setTime(userInfo.dateOfBirth.getTime() + 60 * 60 * 1000);
      userInfo = removeNullProperty({
        photo: userInfo.photo != currentUser.photo ? userInfo.photo : null,
        gender: userInfo.gender != currentUser.gender ? userInfo.gender : null,
        firstName: userInfo.firstName != currentUser.firstName ? userInfo.firstName : null,
        lastName: userInfo.lastName != currentUser.lastName ? userInfo.lastName : null,
        email: userInfo.email != currentUser.email ? userInfo.email : null,
        dateOfBirth:
          userInfo.dateOfBirth.getTime() != currentUser.dateOfBirth.getTime()
            ? userInfo.dateOfBirth
            : null,
        phoneNumber: userInfo.phoneNumber != currentUser.phoneNumber ? userInfo.phoneNumber : null
      });
      const [updateOptionalData] = await OptionalInfo.update(optionalInfo, {
        where: { id: optionalInfoId }
      });
      const [updateUserInfo] = await User.update({ ...userInfo }, { where: { id: userId } });
      const userInfoData = await getUserInfo(userId);
      const success =
        updateOptionalData == 0 && updateUserInfo == 0 ? 'Nothing updated' : 'Profile info updated';

      return super.returnResponse(200, { success, userInfoData });
    } catch (error) {
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }
}

const ProfileServiceInstance = new ProfileService();

module.exports = ProfileServiceInstance;
