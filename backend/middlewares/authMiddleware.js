const { decodeToken, findUserByEmail, createAccessToken } = require("../helpers/authHelper");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization.split(" ")[1] || null;
    const refreshToken = req.cookies.jid;
    const decoded = decodeToken(authorization);
    const decodedRefresh = decodeToken(refreshToken);
    const user = await findUserByEmail(decoded.email, false);
    if (
      !authorization ||
      !refreshToken ||
      !decoded ||
      !decodedRefresh ||
      Date.now() >= decodedRefresh.exp * 1000 ||
      !user
    ) {
      return res.status(401).json({ authorizationError: "Unauthorized request. Please login" });
    }

    if (decoded.exp * 1000 <= Date.now()) {
      const accessToken = createAccessToken({
        id: decoded.id,
        email: decoded.email
      });
      req.accessToken = accessToken;
    }

    if (decoded.id) {
      req.userId = decoded.id;
    }
  } catch (error) {
    return res.status(401).json({ authorizationError: "Unauthorized request. Please login" });
  }
  return next();
};
