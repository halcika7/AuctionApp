const AuthServiceInstance = require('../services/AuthService');
const BaseController = require('./BaseController');

class AuthController extends BaseController {
  constructor() {
    super(AuthController);
  }

  async registerUser(req, res) {
    const { status, response } = await AuthServiceInstance.register(req.body);
    return super.sendResponse(res, status, response);
  }

  async loginUser(req, res) {
    const { status, response, refreshToken } = await AuthServiceInstance.login(req.body);
    if (!response.errors && !response.err) {
      AuthServiceInstance.setRefreshTokenCookie(res, refreshToken);
    }
    return super.sendResponse(res, status, response);
  }

  async logout(req, res) {
    AuthServiceInstance.setRefreshTokenCookie(res, '');
    return super.sendResponse(res, 200, { accessToken: '' });
  }

  async refreshToken(req, res) {
    const token = req.cookies.jid;
    const { status, response, refreshToken } = await AuthServiceInstance.refreshToken(token);
    if (!response.authorizationError && token) {
      AuthServiceInstance.setRefreshTokenCookie(res, refreshToken);
    }
    return super.sendResponseWithMessage(
      res,
      status,
      response,
      !token ? { accessToken: '' } : undefined
    );
  }
}

const AuthControllerInstance = new AuthController();

module.exports = AuthControllerInstance;
