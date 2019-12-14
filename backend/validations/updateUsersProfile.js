const CardInfo = require('../models/CardInfo');
const { findUserByEmail } = require('../helpers/authHelper');
const { client } = require('../config/twilioConfig');
const stripe = require('../config/stripeConfig');
const isEmpty = require('./is-empty');
const { nameValidation, emailValidation } = require('./authValidation');
const { removeNullProperty } = require('../helpers/removeNullProperty');

exports.userInfoValidation = async (userInfo, email) => {
  let errors = {};
  const currentUser = await findUserByEmail(email);
  const enteredEmailUser = await findUserByEmail(userInfo.email);
  let data = { ...userInfo };
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.gender = !isEmpty(data.gender) ? data.gender : '';
  data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : '';
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : '';
  const date = new Date(data.dateOfBirth);

  if (data.gender == '') {
    errors.gender = 'Gender is required';
  } else if (data.gender != 'Male' && data.gender != 'Female' && data.gender != 'Other') {
    errors.gender = 'Invalid gender type';
  }

  if (Object.prototype.toString.call(date) != '[object Date]' || isNaN(date.getTime())) {
    errors.dateOfBirth = 'Invalid date of birth';
  }

  if(data.phoneNumber) {
    try {
      await client.lookups.phoneNumbers(data.phoneNumber).fetch({ type: ['carrier'] });
    } catch (error) {
      errors.phoneNumber = error.message + '. Please use valid country code.';
    }
  }


  nameValidation('firstName', data.firstName, errors, 'First name');
  nameValidation('lastName', data.lastName, errors, 'Last name');
  emailValidation(data.email, errors);

  if (!errors.email && enteredEmailUser && currentUser.id !== enteredEmailUser.id) {
    errors.email = 'Email already in use';
  }

  return {
    errors: { errors },
    isValid: isEmpty(errors),
    currentUser
  };
};

exports.userCardValidation = async (cardInfo, userCardInfoId, errors) => {
  if (
    Object.keys(removeNullProperty(cardInfo)).length == 0 ||
    (cardInfo.cvc == '****' && cardInfo.number.includes('************'))
  ) {
    return { isValid: true, errors, cardInfoData: {} };
  }
  try {
    const {
      id,
      card: { fingerprint, last4 }
    } = await stripe.tokens.create({
      card: {
        ...cardInfo
      }
    });
    const findCardIfExists = await CardInfo.findOne({
      where: { cardFingerprint: fingerprint },
      attributes: ['id', 'cardFingerprint']
    });

    if (findCardIfExists && findCardIfExists.id !== userCardInfoId) {
      errors.errors.card = 'Card already in use';
      return { isValid: false, errors };
    }
    cardInfo = {
      ...cardInfo,
      cardFingerprint: fingerprint,
      cardToken: id,
      number: '************' + last4,
      cvc: '****'
    };

    return { isValid: true, errors, cardInfoData: cardInfo };
  } catch (error) {
    if(errors.errors) {
      errors.errors.card = error.raw.message;
    } else {
      errors.card = error.raw.message;
    }
    return { isValid: false, errors };
  }
};
