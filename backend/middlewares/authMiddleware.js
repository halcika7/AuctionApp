const { verifyAccessToken } = require('../helpers/authHelper');
const { setRefreshTokenCookie } = require('../services/AuthService');

module.exports = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return helper(res);
    }
    try {
        const payload = verifyAccessToken(authorization);
        req.payload = payload;
    } catch (error) {
        return helper(res);
    }
    return next();
};

function helper(res) {
    setRefreshTokenCookie(res, '');
    return res.status(200).json({ authorizationError: 'Unauthorized request', accessToken: '' });
}
