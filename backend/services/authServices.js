const { registerValidation, loginValidation } = require('../validations/authValidation');
const {
    createAccessToken,
    createRefreshToken,
    createUser,
    findUserByEmail,
    verifyRefreshToken
} = require('../helpers/authHelper');

class AuthService {
    constructor() {
        if (!!AuthService.instance) return AuthService.instance;
        AuthService.instance = this;
        return this;
    }

    async register(data) {
        try {
            const { errors, isValid } = await registerValidation(data);
            if (!isValid) return { status: 403, response: { ...errors } };
            await createUser(data);
            return { status: 200, response: { successMessage: 'Account successfully created !' } };
        } catch (error) {
            return { status: 403, response: { err: error.message } };
        }
    }

    async login(data) {
        try {
            const { errors, isValid, user } = await loginValidation(data);
            if (!isValid) return { status: 403, response: { ...errors } };
            const accessToken = createAccessToken(user),
                refreshToken = createRefreshToken(user);
            return {
                status: 200,
                response: { successMessage: 'success', accessToken },
                refreshToken
            };
        } catch (error) {
            return { status: 403, response: { err: error.message } };
        }
    }

    async refreshToken(token) {
        try {
            const payload = verifyRefreshToken(token),
                user = await findUserByEmail(payload.email, false);
            if (!user) {
                return { status: 400, response: { accessToken: '' } };
            }
            return {
                status: 200,
                response: { accessToken: createAccessToken(user) },
                refreshToken: createRefreshToken(user)
            };
        } catch {
            return { status: 400, response: { accessToken: '' } };
        }
    }

    setRefreshTokenCookie(res, token) {
        return res.cookie('jid', token, { httpOnly: true });
    }
}

const AuthServcieInstance = new AuthService();

module.exports = AuthServcieInstance;
