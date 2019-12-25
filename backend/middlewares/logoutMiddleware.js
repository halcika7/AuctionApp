const { decodeToken } = require('../helpers/authHelper');

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization.split(' ')[1] || null;
  const decoded = decodeToken(authorization);

  if(decoded) {
    req.userId = decoded.id;
    req.email = decoded.email;
  }

  return next();
};
