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

    if (isEmpty(data.firstName)) {
        errors.firstName = 'First name is required';
    } else if (!Validator.isLength(data.firstName, { min: 2 })) {
        errors.firstName = 'First name must contain at least 2 characters';
    } else if (!Validator.isLength(data.firstName, { max: 100 })) {
        errors.firstName = 'First name cannot exceed 100 characters';
    }

    if (isEmpty(data.lastName)) {
        errors.lastName = 'Last name is required';
    } else if (!Validator.isLength(data.lastName, { min: 2 })) {
        errors.lastName = 'Last name must contain at least 2 characters';
    } else if (!Validator.isLength(data.lastName, { max: 100 })) {
        errors.lastName = 'Last name cannot exceed 100 characters';
    }

    if (isEmpty(data.password)) {
        errors.password = 'Password is required';
    } else if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password must contain at least 6 characters';
    } else if (!Validator.isLength(data.password, { max: 30 })) {
        errors.password = 'Password cannot exceed 100 characters';
    } else if (!strongRegex.test(data.password)) {
        errors.password =
            'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character($#%) and length must be between 6 and 30 characters';
    }

    if (isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Please Enter Valid Email Address !!';
    } else if (user) {
        errors.email = 'Email already in use!';
    }

    return { errors: { errors }, isValid: isEmpty(errors) };
};

exports.loginValidation = async data => {
    let errors = {};
    let errorMessage = '';
    const user = await findUserByEmail(data.email);

    if (isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Please enter valid email address !!';
    }

    if (isEmpty(data.password)) errors.password = 'Password is required';

    if (!user && !isEmpty(data.password) && !isEmpty(data.email) && Validator.isEmail(data.email)) {
        errorMessage = 'Incorrect email or password';
    }

    if (!isEmpty(data.password) && user) {
        const byCrypt = await comparePassword(data.password, user.password);
        if (!byCrypt) {
            errorMessage = 'Incorrect email or password';
        }
    }

    if (!isEmpty(errors)) {
        return { errors: { errors }, isValid: false };
    } else if (!isEmpty(errorMessage)) {
        return { errorMessage, isValid: false };
    } else {
        delete user.password;
        return { user, isValid: true };
    }
};
