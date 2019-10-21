const { registerValidation, loginValidation } = require('../validations/authValidation');
const { createAccessToken, createRefreshToken, createUser } = require('../helpers/authHelper');

class AuthServcie {
    constructor() {
        if (!!AuthServcie.instance) return AuthServcie.instance;
        AuthServcie.instance = this;
        return this;
    }

    async registerUser(data) {
        try {
            const { errors, isValid } = await registerValidation(data);
            if (!isValid) return { status: 422, response: { ...errors } };
            await createUser(data);
            return { status: 200, response: { successMessage: 'Account successfulyy created !' } };
        } catch (error) {
            return { status: 422, response: { err: error.message } };
        }
    }

    async loginUser(data) {
        try {
            const { errors, isValid, user } = await loginValidation(data);
            if (!isValid) return { status: 400, response: { ...errors } };
            const accessToken = createAccessToken(user),
                refreshToken = createRefreshToken(user);
            return { status: 200, response: { message: 'fijodsjif', accessToken }, refreshToken };
        } catch (error) {
            return { status: 200, response: { err: error.message } };
        }
    }

    setRefreshTokenCookie(res, token) {
        return res.cookie('jid', token, { httpOnly: true, secure: true });
    }
}

const AuthServcieInstance = new AuthServcie();

module.exports = AuthServcieInstance;
