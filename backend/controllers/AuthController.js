const { register, login, setRefreshTokenCookie } = require('../services/authServices');

module.exports = class AuthController {
    constructor() {
        if (!!AuthController.instance) return AuthController.instance;
        AuthController.instance = this;
        return this;
    }

    async registerUser(req, res) {
        const { status, response } = await register(req.body);
        return res.status(status).json(response);
    }

    async loginUser(req, res) {
        const { status, response, refreshToken } = await login(req.body);
        setRefreshTokenCookie(res, refreshToken);
        return res.status(status).json(response);
    }

    async logout(req, res) {
        setRefreshTokenCookie(res, '');
        return res.status(200).json({ message: 'logout', accessToken: '' });
    }
};
