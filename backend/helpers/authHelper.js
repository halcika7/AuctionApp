const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OptionalInfo = require('../models/OptionalInfo');
const CardInfo = require('../models/CardInfo');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config/configs');

exports.createAccessToken = ({ id, email }) =>
  jwt.sign({ id, email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

exports.createRefreshToken = ({ id, email }) =>
  jwt.sign({ id, email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

exports.verifyRefreshToken = token => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch {
    return { err: 'Token expired' };
  }
};

exports.verifyAccessToken = token => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch {
    return { err: 'Token expired' };
  }
};

exports.decodeToken = token => jwt.decode(token);

exports.comparePassword = async (psd1, psd2) => await bcrypt.compare(psd1, psd2);

exports.findUserByEmail = async (email, withPassword = true) => {
  const exclude = withPassword ? [] : ['password'];
  return await User.findOne({
    attributes: { exclude },
    where: { email },
    raw: true
  });
};

exports.getUserInfo = async id => {
  return await User.findOne({
    where: { id },
    include: [
      {
        model: OptionalInfo,
        attributes: {
          exclude: ['id']
        }
      },
      {
        model: CardInfo,
        attributes: {
          exclude: ['id', 'cardToken', 'cardFingerprint']
        }
      }
    ],
    attributes: [
      'id',
      'firstName',
      'lastName',
      'email',
      'photo',
      'gender',
      'phoneNumber',
      'dateOfBirth'
    ]
  });
};

exports.createOptionalInfo = async () => {
  return await OptionalInfo.create({});
};

exports.createCardInfo = async () => {
  return await CardInfo.create({});
};

exports.createUser = async (
  { firstName, lastName, email, password },
  optionalInfoId,
  cardInfoId
) => {
  password = await this.hashPassword(password);
  return await User.create({
    firstName,
    lastName,
    email,
    password,
    optionalInfoId,
    cardInfoId,
    photo: 'https://static.thenounproject.com/png/363633-200.png'
  });
};

exports.hashPassword = async password => await bcrypt.hash(password, 10);
