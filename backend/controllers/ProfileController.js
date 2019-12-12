const BaseController = require('./BaseController');
const ProfileService = require('../services/ProfileService');

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
    const { userId, email, accessToken } = req;
    const { status, success, errors, message, userInfoData } = await ProfileService.updateUserInfo(
      req.file,
      req.body,
      userId,
      email
    );
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
}

const ProfileControllerInstance = new ProfileController();

module.exports = ProfileControllerInstance;
