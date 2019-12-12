const OptionalInfo = require('../models/OptionalInfo');
const { findUserByEmail } = require('../helpers/authHelper');
const { client } = require('../config/twilioConfig');
const { Address, addressValidator } = require('../config/addressValidatorConfig');
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

  try {
    const phone = await client.lookups.phoneNumbers(data.phoneNumber).fetch({ type: ['carrier'] });
    if (!phone.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    }
  } catch (error) {
    errors.phoneNumber = 'Invalid phone number';
  }

  nameValidation('firstName', data.firstName, errors, 'First name');
  nameValidation('lastName', data.lastName, errors, 'Last name');
  emailValidation(data.email, errors);

  if (!errors.email && currentUser.id !== enteredEmailUser.id) {
    errors.email = 'Email already in use';
  }

  return {
    errors: { errors },
    isValid: isEmpty(errors),
    optionalInfoId: currentUser.optionalInfoId,
    cardInfoId: currentUser.cardInfoId,
    currentUser
  };
};

exports.userCardValidation = async cardInfo => {
  
};

optionalInfoValidation = async (optionalInfo, userOptionalInfo, optionalInfoId) => {
  // const cardToken = await stripe.tokens.create({
  //   card: {
  //     name: 'Haris Beslic',
  //     number: '4242424242424242',
  //     exp_month: '02',
  //     exp_year: '2020',
  //     cvc: 111
  //   }
  // });
  // const userOptionalInfo = await OptionalInfo.findOne({ where: { id: optionalInfoId } });
  // optionalInfo = removeNullProperty({
  //   street: optionalInfo.street !== userOptionalInfo.street ? optionalInfo.street : null,
  //   city: optionalInfo.city !== userOptionalInfo.city ? optionalInfo.city : null,
  //   postalCode: optionalInfo.zip !== userOptionalInfo.zip ? optionalInfo.zip : null,
  //   country: optionalInfo.country !== userOptionalInfo.country ? optionalInfo.country : null,
  //   state: optionalInfo.state !== userOptionalInfo.state ? optionalInfo.state : null
  // });
  optionalInfo = removeNullProperty({
    // street: optionalInfo.street,
    city: optionalInfo.city,
    zip: optionalInfo.zip,
    country: optionalInfo.country,
    state: optionalInfo.state
  });
  console.log('TCL: exports.optionalInfoValidation -> optionalInfo', optionalInfo);

  // const address = new Address({
  //   ...optionalInfo
  // });
  // addressValidator.validate(address, addressValidator.match.streetAddress, function(
  //   err,
  //   exact,
  //   inexact
  // ) {
  //   vals = { err, exact, inexact };
  //   return { err, exact, inexact };
  // });
};
