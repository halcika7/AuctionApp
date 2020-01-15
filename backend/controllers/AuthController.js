const AuthServiceInstance = require('../services/AuthService');
const BaseController = require('./BaseController');
const { decodeToken } = require('../helpers/authHelper');
const { PassportService } = require('../services/PassportService');
const NotificationService = require('../services/NotificationService');

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

    if (!response.errors && !response.err && req.body.remember) {
      AuthServiceInstance.setRefreshTokenCookie(res, refreshToken);
    }

    return super.sendResponse(res, status, response);
  }

  socialLogin(req, res, provider) {
    return PassportService.socialCallback(req, res, provider);
  }

  async logout(req, res, io) {
    const token = super.getAuthorizationHeader(req);
    const { id } = decodeToken(token) || { id: undefined };
    AuthServiceInstance.removeLoggedUser(id);
    AuthServiceInstance.setRefreshTokenCookie(res, '');

    if (id) {
      NotificationService.removeUserFromAllProducts(io, id);
    }

    return super.sendResponse(res, 200, { accessToken: '' });
  }

  async refreshToken(req, res) {
    const token = req.remember ? req.cookies.jid : req.accessToken;
    const { status, response, refreshToken } = await AuthServiceInstance.refreshToken(token, req.remember);

    if (!response.authorizationError && req.remember) {
      AuthServiceInstance.setRefreshTokenCookie(res, refreshToken);
    }

    return super.sendResponseWithMessage(
      res,
      status,
      response,
      req.remember && !token ? { accessToken: '' } : undefined
    );
  }

  async forgotPassword(req, res) {
    const { status, response } = await AuthServiceInstance.forgotPassword(req.body.email);

    return super.sendResponse(res, status, response);
  }

  async resetPassword(req, res) {
    const { status, response } = await AuthServiceInstance.resetPassword(req.body);

    return super.sendResponse(res, status, response);
  }

  removeLoggedInUser(token) {
    token = token.split(' ')[1];
    const { id } = decodeToken(token) || { id: undefined };
    AuthServiceInstance.removeLoggedUser(id);

    return true;
  }

  async activateAccount(req, res) {
    const { status, response } = await AuthServiceInstance.activateAccount(req.body);

    return super.sendResponse(res, status, response);
  }

  async reactivateAccount(req, res) {
    const { status, response } = await AuthServiceInstance.reactivateAccount(req.body);

    return super.sendResponse(res, status, response);
  }
}

const AuthControllerInstance = new AuthController();

module.exports = AuthControllerInstance;
