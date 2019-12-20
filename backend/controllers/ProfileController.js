const BaseController = require('./BaseController');
const ProfileService = require('../services/ProfileService');
const AuthService = require('../services/AuthService');

class ProfileController extends BaseController {
  constructor() {
    super(ProfileController);
  }

  async getUserInfo(req, res) {
    const { userId, accessToken } = req;
    const { userInfo, status, message } = await ProfileService.fetchUserInfo(userId);
    return super.sendResponseWithMessage(res, status, { userInfo, accessToken }, message);
  }

  async updateProfileInfo(req, res) {
    const { userId, email } = req;
    const {
      status,
      success,
      errors,
      message,
      userInfoData,
      accessToken,
      refreshToken
    } = await ProfileService.updateUserInfo(req.file, req.body, userId, email);
    if (refreshToken) {
      AuthService.setRefreshTokenCookie(res, refreshToken);
    }
    return super.sendResponseWithMessage(
      res,
      status,
      { errors, message: success, accessToken, userInfo: userInfoData },
      message
    );
  }

  async deactivateAccount(req, res) {
    const { userId } = req;
    const { status, message } = await ProfileService.deactivateUserAccount(userId);
    return super.sendResponseWithMessage(res, status, {}, message);
  }

  async getUserOptionalInfo(req, res) {
    const { userId } = req;
    const { status, message, userInfo } = await ProfileService.userOptionalInfoWithCard(userId);
    return super.sendResponseWithMessage(res, status, { userInfo }, message);
  }
}

const ProfileControllerInstance = new ProfileController();

module.exports = ProfileControllerInstance;
