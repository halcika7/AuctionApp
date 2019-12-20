const BaseService = require('./BaseService');
const User = require('../models/User');
const CardInfoService = require('../services/CardInfoService');
const OptionalInfoService = require('../services/OptionalInfoService');
const CloudinaryService = require('../services/CloudinaryService');
const { removeNullFromUserInfo } = require('../helpers/removeNullProperty');
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

      const { isValid: validCard, errors, cardInfoData } = await userCardValidation(
        cardInfo,
        userId,
        email,
        requiredInfoErrors,
        isValid
      );

      if (!validCard || !isValid) {
        file && file.path && unlinkFiles([file]);
        return super.returnResponse(403, errors);
      }

      if (file && file.path) {
        const { secure_url } = await CloudinaryService.uploadProfilePhoto(file.path, userId);

        userInfo.photo = secure_url;
        
        unlinkFiles([file]);
      } else {
        userInfo.photo = currentUser.photo;
      }

      userInfo = removeNullFromUserInfo(userInfo, currentUser);

      const [updateOptionalData] = await OptionalInfoService.update(optionalInfo, userId);
      const [updatedCardInfoData] = await CardInfoService.updateCardInfo(cardInfoData, userId);
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
