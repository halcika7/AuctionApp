const Validator = require("validator");
const isEmpty = require("./is-empty");
const { comparePassword, findUserByEmail, decodeToken } = require("../helpers/authHelper");
const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})");

exports.registerValidation = async data => {
  let errors = {};
  const user = await findUserByEmail(data.email);
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  nameValidation("firstName", data.firstName, errors, "First name");

  nameValidation("lastName", data.lastName, errors, "Last Name");

  passwordValidation(data.password, errors);

  emailValidation(data.email, errors);

  if (!errors.email && user) {
    errors.email = "Email already in use!";
  }

  return { errors: { errors }, isValid: isEmpty(errors) };
};

exports.loginValidation = async data => {
  let errors = {};
  let message = "";
  const user = await findUserByEmail(data.email);

  emailValidation(data.email, errors);

  if (isEmpty(data.password)) errors.password = "Password is required";

  if (!user && !isEmpty(data.password) && !isEmpty(data.email) && Validator.isEmail(data.email)) {
    message = "Incorrect email or password";
  }

  if (!isEmpty(data.password) && user) {
    const byCrypt = await comparePassword(data.password, user.password);
    if (!byCrypt) {
      message = "Incorrect email or password";
    }
  }

  if (user && user.resetPasswordToken) {
    message = "Please reset your password";
  }

  return returnDataHelper(errors, message, { user });
};

exports.forgotPasswordValidation = async email => {
  let errors = {};
  const user = await findUserByEmail(email);
  if (!email) {
    errors.email = "Email is required";
  }
  if (!user) {
    errors.email = "User not found with provided email";
  }

  return returnDataHelper(errors, "", { user });
};

exports.resetPasswordValidation = async (resetPasswordToken, password) => {
  let errors = {};
  let message = "";
  const decodedToken = decodeToken(resetPasswordToken);
  const user = await findUserByEmail(decodedToken.email);
  const samePasswords = await comparePassword(password, user.password);

  if (isEmpty(decodedToken)) {
    message = "Token not provided";
  } else if (Date.now() > decodedToken.exp * 1000) {
    message = "Token expired";
  }

  if (!user) {
    message = "User not found";
  } else if (user.resetPasswordToken !== resetPasswordToken) {
    message = "Invalid token";
  }

  passwordValidation(password, errors);

  if (!errors.password && samePasswords) {
    errors.password = "Password already in use";
  }

  return returnDataHelper(errors, message, { email: user.email });
};

function emailValidation(email, errors) {
  if (isEmpty(email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(email)) {
    errors.email = "Please enter valid email address !!";
  }
}

function passwordValidation(password, errors) {
  if (isEmpty(password)) {
    errors.password = "Password is required";
  } else if (!Validator.isLength(password, { min: 6 })) {
    errors.password = "Password must contain at least 6 characters";
  } else if (!Validator.isLength(password, { max: 30 })) {
    errors.password = "Password cannot exceed 100 characters";
  } else if (!strongRegex.test(password)) {
    errors.password =
      "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character($#%) and length must be between 6 and 30 characters";
  }
}

function nameValidation(type, value, errors, resp) {
  if (isEmpty(value)) {
    errors[type] = resp + " is required";
  } else if (!Validator.isLength(value, { min: 2 })) {
    errors[type] = resp + " must contain at least 2 characters";
  } else if (!Validator.isLength(value, { max: 100 })) {
    errors[type] = resp + " cannot exceed 100 characters";
  }
}

function returnDataHelper(errors, message, returnValue) {
  if (!isEmpty(errors)) {
    return { errors: { errors }, isValid: false };
  } else if (!isEmpty(message)) {
    return { message, isValid: false };
  } else {
    return { isValid: true, ...returnValue };
  }
}
