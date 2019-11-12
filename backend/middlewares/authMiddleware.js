const { decodeToken, createAccessToken, findUserByEmail } = require('../helpers/authHelper');

module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization.split(' ')[1] || null;
        const refreshToken = req.cookies.jid;
        const decoded = decodeToken(authorization);
        const decodedRefresh = decodeToken(refreshToken);
        const user = await findUserByEmail(decoded.email, false);
        if (
            !authorization ||
            !decoded ||
            !decoded.id ||
            !decoded.email ||
            !decoded.exp ||
            !decoded.iat ||
            !refreshToken ||
            !decodedRefresh ||
            !decodedRefresh.id ||
            !decodedRefresh.email ||
            !decodedRefresh.exp ||
            !decodedRefresh.iat ||
            Date.now() >= decodedRefresh.exp * 1000 ||
            !user
        ) {
            return res.status(401).json({ authorizationError: 'Unauthorized request' });
        }
        if (decoded.id) {
            req.userId = decoded.id;
        }
    } catch (error) {
        return res.status(401).json({ authorizationError: 'Unauthorized request' });
    }
    return next();
};
