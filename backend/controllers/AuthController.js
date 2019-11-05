const AuthServiceInstance = require('../services/AuthService');
const BaseController = require('./BaseController');

class AuthController extends BaseController {
    constructor() {
        super(AuthController);
    }

    async registerUser(req, res) {
        const { status, response } = await AuthServiceInstance.register(req.body);
        return res.status(status).json(response);
    }

    async loginUser(req, res) {
        const { status, response, refreshToken } = await AuthServiceInstance.login(req.body);
        if (!response.errors && !response.err) {
            AuthServiceInstance.setRefreshTokenCookie(res, refreshToken);
        }
        return res.status(status).json(response);
    }

    async logout(req, res) {
        AuthServiceInstance.setRefreshTokenCookie(res, '');
        return res.status(200).json({ accessToken: '' });
    }

    async refreshToken(req, res) {
        const token = req.cookies.jid;
        if (!token) {
            return res.status(400).json({ accessToken: '' });
        }
        const { status, response, refreshToken } = await AuthServiceInstance.refreshToken(token);
        if (!response.authorizationError) {
            AuthServiceInstance.setRefreshTokenCookie(res, refreshToken);
        }
        return res.status(status).json(response);
    }
}

const AuthControllerInstance = new AuthController();

module.exports = AuthControllerInstance;
