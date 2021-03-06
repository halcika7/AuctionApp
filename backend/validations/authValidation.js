const Validator = require('validator');
const isEmpty = require('./is-empty');
const { comparePassword, findUserByEmail, decodeToken } = require('../helpers/authHelper');
const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})');
const axios = require('axios');
const { NEVERBOUNCE_URL } = require('../config/configs');

exports.registerValidation = async data => {
  let errors = {};
  const user = await findUserByEmail(data.email);
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';
  data.email = !isEmpty(data.email) ? data.email : '';

  this.nameValidation('firstName', data.firstName, errors, 'First name');

  this.nameValidation('lastName', data.lastName, errors, 'Last name');

  this.passwordValidation(data.password, errors, {});

  this.passwordValidation(data.confirmPassword, errors, {
    response: 'Confirm password',
    name: 'confirmPassword',
    checkEquality: data.password
  });

  await this.emailValidation(data.email, errors);

  if (!errors.email && user) {
    errors.email = 'Email already in use';
  }

  return { errors: { errors }, isValid: isEmpty(errors) };
};

exports.loginValidation = async data => {
  let errors = {};
  let message = '';
  const user = await findUserByEmail(data.email);

  if (!user) {
    message = 'Incorrect email or password';
    return this.returnData(errors, message, {});
  }

  if (user.deactivated) {
    message = 'Your account is deactivated';
    return this.returnData(errors, message, { user });
  } else if (user.activationToken) {
    message = 'Please verify email address';
    return this.returnData(errors, message, { user });
  }

  await this.emailValidation(data.email, errors, true);

  if (isEmpty(data.password)) errors.password = 'Password is required';

  if (!user && !isEmpty(data.password) && !isEmpty(data.email) && Validator.isEmail(data.email)) {
    message = 'Incorrect email or password';
  }

  if (!isEmpty(data.password) && user) {
    try {
      const byCrypt = await comparePassword(data.password, user.password);
      if (!byCrypt) {
        message = 'Incorrect email or password';
      }
    } catch (error) {
      message = 'Please try with Facebook or Google login';
    }
  }

  if (user && user.resetPasswordToken) {
    message = 'Please reset your password';
  }

  return this.returnData(errors, message, { user });
};

exports.forgotPasswordValidation = async email => {
  let errors = {};
  const user = await findUserByEmail(email);

  if (!email) {
    errors.email = 'Email is required';
  }

  if (!user) {
    errors.email = 'User not found with provided email';
  }

  return this.returnData(errors, '', { user });
};

exports.resetPasswordValidation = async (resetPasswordToken, password) => {
  let errors = {};
  let message = '';
  const decodedToken = decodeToken(resetPasswordToken);
  const user = await findUserByEmail(decodedToken.email);
  const samePasswords = await comparePassword(password, user.password);

  if (isEmpty(decodedToken)) {
    message = 'Token not provided';
  } else if (Date.now() > decodedToken.exp * 1000) {
    message = 'Token expired';
  }

  if (!user) {
    message = 'User not found';
  } else if (user.resetPasswordToken !== resetPasswordToken) {
    message = 'Invalid token';
  }

  this.passwordValidation(password, errors, {});

  if (!errors.password && samePasswords) {
    errors.password = 'Password already in use';
  }

  return this.returnData(errors, message, { email: user.email });
};

exports.emailValidation = async (email, errors, login = false) => {
  if (isEmpty(email)) {
    errors.email = 'Email is required';
    return;
  }

  if(!login) {
    try {
      const response = await axios.get(`${NEVERBOUNCE_URL}&email=${email}`);
      const data = response.data;
      if (data.result != 'valid') {
        errors.email = 'Please enter valid email address';
      }
    } catch (error) {
      errors.email = 'Please enter valid email address';
    }
  }

};

exports.passwordValidation = (
  password,
  errors,
  { response = 'Password', name = 'password', checkEquality = null }
) => {
  if (isEmpty(password)) {
    errors[name] = `${response} is required`;
  } else if (!Validator.isLength(password, { min: 6 })) {
    errors[name] = `${response} must contain at least 6 characters`;
  } else if (!Validator.isLength(password, { max: 30 })) {
    errors[name] = `${response} cannot exceed 100 characters`;
  } else if (!strongRegex.test(password)) {
    errors[name] =
      'Your password needs to contain both lower and upper case characters, number and a special character.';
  }

  if (checkEquality && checkEquality !== password) {
    errors[name] = 'Confirm password should be equal to provided password';
  }
};

exports.nameValidation = (type, value, errors, resp) => {
  if (isEmpty(value)) {
    errors[type] = resp + ' is required';
  } else if (!Validator.isLength(value, { min: 2 })) {
    errors[type] = resp + ' must contain at least 2 characters';
  } else if (!Validator.isLength(value, { max: 100 })) {
    errors[type] = resp + ' cannot exceed 100 characters';
  }
};

exports.returnData = (errors, message, returnValue) => {
  if (!isEmpty(errors)) {
    return { errors: { errors }, isValid: false };
  } else if (!isEmpty(message)) {
    return { message, isValid: false };
  } else {
    return { isValid: true, ...returnValue };
  }
};
