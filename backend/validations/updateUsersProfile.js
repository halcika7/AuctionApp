const CardInfo = require('../models/CardInfo');
const { findUserByEmail } = require('../helpers/authHelper');
const { client } = require('../config/twilioConfig');
const stripe = require('../config/stripeConfig');
const isEmpty = require('./is-empty');
const { nameValidation, emailValidation } = require('./authValidation');
const { removeNullProperty } = require('../helpers/removeNullProperty');
const { validateCard } = require('../helpers/stripeHelpers');

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

  if (data.phoneNumber) {
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

exports.userCardValidation = async (cardInfo, userCardInfoId, email, errors) => {
  if (
    Object.keys(removeNullProperty(cardInfo)).length == 0 ||
    (cardInfo.cvc == '****' && cardInfo.number.includes('************'))
  ) {
    return { isValid: true, errors, cardInfoData: {} };
  }
  try {
    const { card, id, valid } = await validateCard(errors, userCardInfoId, cardInfo);
    if (!valid) {
      return { isValid: false, errors };
    }
    let customerId;
    const customer = await CardInfo.findOne({
      raw: true,
      where: { id: userCardInfoId },
      attributes: ['customerId', 'cardId']
    });
    if (!customer) {
      const { id } = await stripe.customers.create({
        description: 'Customer for atlant auction app',
        email
      });
      customerId = id;
    } else {
      customerId = customer.customerId;
    }
    if (customer.cardId) {
      await stripe.customers.deleteSource(customerId, customer.cardId);
    }
    await stripe.customers.createSource(customerId, { source: id });
    cardInfo = {
      ...cardInfo,
      customerId,
      cardId: card.id,
      cardFingerprint: card.fingerprint,
      number: '************' + card.last4,
      cvc: '****'
    };

    return { isValid: true, errors, cardInfoData: cardInfo };
  } catch (error) {
    errors.errors.card = error.raw.message;
    return { isValid: false, errors };
  }
};
