const BaseService = require('./BaseService');
const User = require('../models/User');
const OptionalInfo = require('../models/OptionalInfo');
const CardInfo = require('../models/CardInfo');
const fs = require('fs');
const { cloudinary } = require('../config/cloudinaryConfig');
const { removeNullProperty, removeNullFromUserInfo } = require('../helpers/removeNullProperty');
const { userInfoValidation, userCardValidation } = require('../validations/updateUsersProfile');
const { getUserInfo, createAccessToken, createRefreshToken } = require('../helpers/authHelper');

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
      //userId, optionalInfoId, cardInfoId are same..
      const { errors: requiredInfoErrors, isValid, currentUser } = await userInfoValidation(
        userInfo,
        email
      );
      const { isValid: validCard, errors, cardInfoData } = await userCardValidation(
        cardInfo,
        userId,
        requiredInfoErrors
      );
      if (!isValid || !validCard) {
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

      const [updateOptionalData] = await OptionalInfo.update(removeNullProperty(optionalInfo), {
        where: { id: userId }
      });

      const [updatedCardInfoData] = await CardInfo.update(cardInfoData, {
        where: { id: userId }
      });

      const [updateUserInfo] = await User.update({ ...userInfo }, { where: { id: userId } });

      const userInfoData = await getUserInfo(userId);

      const accessToken = createAccessToken(userInfoData),
        refreshToken = createRefreshToken(userInfoData);

      const success =
        updateOptionalData == 0 && updateUserInfo == 0 && updatedCardInfoData == 0
          ? 'No changes to user profile are made'
          : 'Profile info updated';

      return super.returnResponse(200, { success, userInfoData, accessToken, refreshToken });
    } catch (error) {
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }
}

const ProfileServiceInstance = new ProfileService();

module.exports = ProfileServiceInstance;
