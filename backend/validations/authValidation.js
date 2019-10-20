const Validator = require('validator');
const isEmpty = require('./is-empty');
const { comparePassword, findUserByEmail } = require('../helpers/authHelper');

exports.registerValidation = async data => {
    let errors = {};
    const user = await findUserByEmail(data.email);
    const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,30})');
    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.email = !isEmpty(data.email) ? data.email : '';

    if (!Validator.isLength(data.firstName, { min: 2, max: 100 })) {
        errors.firstName = 'First name must be between 2 and 100 characters';
    } else if (Validator.isEmpty(data.firstName)) {
        errors.firstName = 'First name field is required';
    }

    if (!Validator.isLength(data.lastName, { min: 2, max: 100 })) {
        errors.lastName = 'Last name must be between 2 and 100 characters';
    } else if (Validator.isEmpty(data.lastName)) {
        errors.lastName = 'Last name field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    } else if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
        errors.password = 'Password must be at least 8 characters';
    } else if (!strongRegex.test(data.password)) {
        errors.password =
            'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character($#%) and length must be between 6 and 30 characters';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    } else if (user) {
        errors.email = 'User already exists with entered email!';
    }

    return { errors: { errors }, isValid: isEmpty(errors) };
};

exports.loginValidation = async data => {
    let errors = {};
    const user = await findUserByEmail(data.email);

    if (Validator.isEmpty(data.email)) errors.email = 'Please provide email';

    if (!user) errors.email = 'User not found with provided email';

    if (Validator.isEmpty(data.password)) errors.password = 'Please provide password';

    if (!Validator.isEmpty(data.password) && user) {
        const byCrypt = await comparePassword(data.password, user.password);
        if (!byCrypt) errors.password = 'Password is incorrect';
    }

    if (!isEmpty(errors)) {
        return { errors: { errors }, isValid: isEmpty(errors) };
    } else {
        delete user.password;
        return { user, isValid: isEmpty(errors) };
    }
};
