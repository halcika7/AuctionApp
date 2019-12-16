const BaseService = require('./BaseService');
const User = require('../models/User');
const OptionalInfo = require('../models/OptionalInfo');
const CardInfo = require('../models/CardInfo');
const { cloudinary } = require('../config/cloudinaryConfig');
const { removeNullProperty, removeNullFromUserInfo } = require('../helpers/removeNullProperty');
const { userInfoValidation, userCardValidation } = require('../validations/updateUsersProfile');
const {
  getUserInfo,
  createAccessToken,
  createRefreshToken,
  getOptionalInfoCard
} = require('../helpers/authHelper');
const { unlinkFiles } = require('../helpers/unlinkFiles');

class ProfileService extends BaseService {
  constructor() {
    super(ProfileService);
  }

  async fetchUserInfo(id) {
    try {
      const userInfo = await getUserInfo(id);
      return super.returnResponse(200, { userInfo });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async deactivateUserAccount(id) {
    try {
      await User.update({ deactivated: true }, { where: { id } });
      return super.returnResponse(200, {});
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async updateUserInfo(file, { userInfo, optionalInfo, cardInfo }, userId, email) {
    userInfo = JSON.parse(userInfo);
    optionalInfo = JSON.parse(optionalInfo);
    cardInfo = JSON.parse(cardInfo);
    try {
      //userId, optionalInfoId and cardInfoId are same
      const { errors: requiredInfoErrors, isValid, currentUser } = await userInfoValidation(
        userInfo,
        email
      );
      if (!isValid) {
        file && file.path && unlinkFiles([file]);
        return super.returnResponse(403, errors);
      }
      const { isValid: validCard, errors, cardInfoData } = await userCardValidation(
        cardInfo,
        userId,
        email,
        requiredInfoErrors
      );
      if (!validCard) {
        file && file.path && unlinkFiles([file]);
        return super.returnResponse(403, errors);
      }
      if (file && file.path) {
        const { secure_url } = await cloudinary.uploader.upload(file.path, {
          public_id: `user-${userId}`
        });
        userInfo.photo = secure_url;
        unlinkFiles([file]);
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
      return super.returnGenericFailed();
    }
  }

  async userOptionalInfoWithCard(id) {
    try {
      const userInfo = await getOptionalInfoCard(id);
      return super.returnResponse(200, { userInfo });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const ProfileServiceInstance = new ProfileService();

module.exports = ProfileServiceInstance;
