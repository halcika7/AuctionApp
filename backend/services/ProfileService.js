const BaseService = require('./BaseService');
const User = require('../models/User');
const OptionalInfo = require('../models/OptionalInfo');
const fs = require('fs');
const { cloudinary } = require('../config/cloudinaryConfig');
const { removeNullProperty } = require('../helpers/removeNullProperty');
const { removeNullFromUserInfo } = require('../helpers/profileHelper');
const { userInfoValidation, userAddressValidation } = require('../validations/updateUsersProfile');
const { getUserInfo } = require('../helpers/authHelper');

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
    cardInfo = JSON.parse(cardInfo);
    try {
      const { errors, isValid, optionalInfoId, cardInfoId, currentUser } = await userInfoValidation(
        userInfo,
        email
      );
      const data = await userAddressValidation(
        optionalInfo
      );
      console.log('TCL: ProfileService -> updateUserInfo -> data', data)
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
      userInfo = removeNullFromUserInfo(userInfo, currentUser);
      const [updateOptionalData] = await OptionalInfo.update(optionalInfo, {
        where: { id: optionalInfoId }
      });
      const [updateUserInfo] = await User.update({ ...userInfo }, { where: { id: userId } });
      const userInfoData = await getUserInfo(userId);
      const success =
        updateOptionalData == 0 && updateUserInfo == 0 ? 'Nothing updated' : 'Profile info updated';

      return super.returnResponse(200, { success, userInfoData });
    } catch (error) {
      console.log('TCL: ProfileService -> updateUserInfo -> error', error)
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }
}

const ProfileServiceInstance = new ProfileService();

module.exports = ProfileServiceInstance;
