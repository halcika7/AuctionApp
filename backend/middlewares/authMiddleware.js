const {
    verifyAccessToken,
    verifyRefreshToken,
    decodeToken,
    createAccessToken
} = require('../helpers/authHelper');
const { setRefreshTokenCookie } = require('../services/authServices');

module.exports = (req, res, next) => {
    try {
        const token = req.headers['authorization'] ? req.headers['authorization'] : '';
        const decodedAccessToken = decodeToken(token),
            { err } = verifyAccessToken(token),
            verifiedRefreshToken = verifyRefreshToken(req.cookies.jid);
        if (verifiedRefreshToken.err) {
            setRefreshTokenCookie(res, '');
            return res
                .status(401)
                .json({ authorizationError: 'Unauthorized request', accessToken: '' });
        }
        if (err && !verifiedRefreshToken.err) {
            delete decodedAccessToken.iat;
            delete decodedAccessToken.exp;
            req.accessToken = createAccessToken(decodedAccessToken);
        }

        next();
    } catch (error) {
        return res.status().json({ authorizationError: 'Unauthorized request', accessToken: '' });
    }
};
