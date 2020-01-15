const CardInfoService = require('../services/CardInfoService');
const StripeService = require('../services/StripeService');
const { findUserByEmail } = require('../helpers/authHelper');
const { client } = require('../config/twilioConfig');
const isEmpty = require('./is-empty');
const { nameValidation, emailValidation } = require('./authValidation');

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

  if (urrentUser.id !== enteredEmailUser.id) {
    await emailValidation(data.email, errors);
  }

  if (!errors.email && enteredEmailUser && currentUser.id !== enteredEmailUser.id) {
    errors.email = 'Email already in use';
  }

  return {
    errors: { errors },
    isValid: isEmpty(errors),
    currentUser
  };
};

exports.userCardValidation = async (
  token,
  name,
  changeCard,
  userCardInfoId,
  email,
  errors,
  isValidUserInfo
) => {
  if (!isValidUserInfo || !token || !changeCard) return { isValid: true, errors };

  if (name && name.length > 100) {
    errors.errors.card = 'Name on card cannot exceed 100 characters';
    return {
      isValid: false,
      errors
    };
  }

  if ((name && !token) || (changeCard && !token)) {
    errors.errors.card = 'Invalid credit card info';
    return {
      isValid: false,
      errors
    };
  }

  let { customerId, cardId, accountId, cardFingerprint } = await CardInfoService.findUserCardInfo(
    userCardInfoId
  );

  try {
    const { card, valid } = await StripeService.validateCard(errors, userCardInfoId, token);

    if (!valid) return { isValid: false, errors };

    if (cardFingerprint === card.fingerprint) return { isValid: true, errors };

    if (!customerId) {
      try {
        const { id: customer } = await StripeService.createCustomer(
          'Customer for atlant auction app',
          email
        );
        const account = await StripeService.createAccount(email);
        if (!customer || !account) throw new Error('Customer or Account not created');
        customerId = customer;
        accountId = account.id;
      } catch (error) {
        errors.errors.card = 'We were unable to create new customer';
        return { isValid: false, errors };
      }
    }

    if (cardId) {
      try {
        await StripeService.deleteSource(customerId, cardId);
      } catch (error) {
        errors.errors.card = error.raw.message;
        return { isValid: false, errors };
      }
    }

    try {
      await StripeService.createSource(customerId, token);
    } catch (error) {
      errors.errors.card = error.raw.message;
      return { isValid: false, errors };
    }

    const cardInfo = {
      name,
      number: '************' + card.last4,
      cvc: '***',
      exp_year: card.exp_year,
      exp_month: card.exp_month,
      customerId,
      accountId,
      cardId: card.id,
      cardFingerprint: card.fingerprint
    };

    return { isValid: true, errors, cardInfoData: cardInfo };
  } catch (error) {
    errors.errors.card = 'We were unable to proccess card information. Please try some other time';
    return { isValid: false, errors };
  }
};
