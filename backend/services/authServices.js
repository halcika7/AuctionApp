const { registerValidation, loginValidation } = require('../validations/authValidation');
const { createAccessToken, createRefreshToken, createUser } = require('../helpers/authHelper');

async function registerUser(data) {
    try {
        const { errors, isValid } = await registerValidation(data);
        if (!isValid) return { status: 200, response: { ...errors } };
        await createUser(data);
        return { status: 200, response: { message: 'success' } };
    } catch (error) {
        return { status: 200, response: { err: error.message } };
    }
}

async function loginUser(data) {
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

function setRefreshTokenCookie(res, token) {
    if (token) return res.cookie('jid', token, { httpOnly: true });
    return false;
}

module.exports = {
    register: registerUser,
    login: loginUser,
    setRefreshTokenCookie
};
