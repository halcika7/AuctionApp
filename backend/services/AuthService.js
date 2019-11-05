const { registerValidation, loginValidation } = require('../validations/authValidation');
const {
    createAccessToken,
    createRefreshToken,
    createUser,
    findUserByEmail,
    verifyRefreshToken
} = require('../helpers/authHelper');
const BaseService = require('./BaseService');

class AuthService extends BaseService {
    constructor() {
        super(AuthService);
    }

    async register(data) {
        try {
            const { errors, isValid } = await registerValidation(data);
            if (!isValid) return { status: 403, response: { ...errors } };
            await createUser(data);
            return { status: 200, response: { successMessage: 'Account successfully created !' } };
        } catch (error) {
            return {
                status: 403,
                response: { err: 'Something happened. We were unable to create an account.' }
            };
        }
    }

    async login(data) {
        try {
            const { errors, errorMessage, isValid, user } = await loginValidation(data);
            if (!isValid && errors) return { status: 403, response: { ...errors } };
            if (!isValid && errorMessage) return { status: 403, response: { err: errorMessage } };
            const accessToken = createAccessToken(user),
                refreshToken = createRefreshToken(user);
            return {
                status: 200,
                response: { successMessage: 'success', accessToken, remember: data.remember },
                refreshToken
            };
        } catch (error) {
            return {
                status: 403,
                response: { err: 'Something happened. We were unable to perform login.' }
            };
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
        } catch (error) {
            return { status: 400, response: { accessToken: '' } };
        }
    }

    setRefreshTokenCookie(res, token) {
        return res.cookie('jid', token, { httpOnly: true, path: '/api/auth/refresh_token' });
    }
}

const AuthServiceInstance = new AuthService();

module.exports = AuthServiceInstance;
