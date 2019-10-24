const AuthServcieInstance = require('../services/authServices');

class AuthController {
    constructor() {
        if (!!AuthController.instance) return AuthController.instance;
        AuthController.instance = this;
        return this;
    }

    async registerUser(req, res) {
        const { status, response } = await AuthServcieInstance.register(req.body);
        return res.status(status).json(response);
    }

    async loginUser(req, res) {
        const { status, response, refreshToken } = await AuthServcieInstance.login(req.body);
        if (!response.errors && !response.err) {
            AuthServcieInstance.setRefreshTokenCookie(res, refreshToken);
        }
        console.log('TCL: AuthController -> loginUser -> response', response);
        return res.status(status).json(response);
    }

    async logout(req, res) {
        AuthServcieInstance.setRefreshTokenCookie(res, '');
        return res.status(200).json({ accessToken: '' });
    }

    async refreshToken(req, res) {
        const token = req.cookies.jid;
        if (!token) {
            return res.status(400).json({ accessToken: '' });
        }
        const { status, response, refreshToken } = await AuthServcieInstance.refreshToken(token);
        if (!response.authorizationError) {
            AuthServcieInstance.setRefreshTokenCookie(res, refreshToken);
        }
        return res.status(status).json(response);
    }
}

const AuthControllerInstance = new AuthController();

module.exports = AuthControllerInstance;
