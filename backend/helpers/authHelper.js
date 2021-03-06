const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Review = require('../models/Review');
const OptionalInfo = require('../models/OptionalInfo');
const CardInfo = require('../models/CardInfo');
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  DEFAULT_USER_IMAGE
} = require('../config/configs');
const { db } = require('../config/database');

exports.createAccessToken = ({ id, email }, expiresIn = '15m', remember = false) =>
  jwt.sign({ id, email, remember }, ACCESS_TOKEN_SECRET, { expiresIn });

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
  } catch(error) {
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

exports.findUserById = async id => {
  return await User.findOne({ raw: true, where: { id } });
};

exports.getUserInfo = async id => {
  return await User.findOne({
    subQuery: false,
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
        attributes: ['name', 'number', 'cvc', 'exp_year', 'exp_month']
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
      'dateOfBirth',
      [
        db.literal(`CASE WHEN "CardInfo"."cardFingerprint" is null THEN false ELSE true END`),
        'hasCard'
      ]
    ]
  });
};

exports.createUser = async (
  { firstName, lastName, email, password, activationToken },
  optionalInfoId,
  cardInfoId
) => {
  password = await this.hashPassword(password);
  return await User.create({
    activationToken,
    firstName,
    lastName,
    email,
    password,
    optionalInfoId,
    cardInfoId,
    photo: DEFAULT_USER_IMAGE
  });
};

exports.hashPassword = async password => await bcrypt.hash(password, 10);

exports.getOptionalInfoCard = async id => {
  return await User.findOne({
    subQuery: false,
    where: { id },
    attributes: [
      'phoneNumber',
      [
        db.literal(`CASE WHEN "CardInfo"."cardFingerprint" is null THEN false ELSE true END`),
        'hasCard'
      ]
    ],
    include: [
      {
        model: OptionalInfo,
        attributes: {
          exclude: ['id']
        }
      },
      {
        model: CardInfo,
        attributes: ['name', 'number', 'cvc', 'exp_year', 'exp_month']
      }
    ]
  });
};

exports.productOwnerInfo = async id =>
  await User.findOne({
    raw: true,
    where: { id },
    attributes: [
      'photo',
      [db.fn('concat', db.col('firstName'), ' ', db.col('lastName')), 'full_name'],
      [
        db.fn(
          'coalesce',
          db.fn('ROUND', db.fn('AVG', db.cast(db.col('Reviews.rating'), 'numeric')), 2),
          0
        ),
        'avg_rating'
      ]
    ],
    include: {
      model: Review,
      attributes: []
    },
    group: ['User.id']
  });

exports.getUsersOptionalInfoIdAndCardInfoId = async id =>
  await User.findOne({
    raw: true,
    where: { id },
    attributes: [
      [db.col('OptionalInfo.id'), 'optionalInfoId'],
      [db.col('CardInfo.id'), 'cardInfoId']
    ],
    include: [
      {
        model: OptionalInfo,
        attributes: []
      },
      {
        model: CardInfo,
        attributes: []
      }
    ]
  });
