const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config/configs');

exports.createAccessToken = ({ id, email }) =>
    jwt.sign({ id, email }, ACCESS_TOKEN_SECRET, { expiresIn: '15s' });

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
    const exclude = withPassword
        ? ['photo', 'gender', 'phoneNumber']
        : ['photo', 'gender', 'phoneNumber', 'password'];
    return await User.findOne({
        attributes: { exclude },
        where: { email },
        raw: true
    });
};

exports.createUser = async ({ firstName, lastName, email, password }) => {
    password = await hashPassword(password);
    return await User.create({ firstName, lastName, email, password });
};

exports.responseWithAccessToken = (resp, accessToken) => ({ ...resp, accessToken });

const hashPassword = async password => await bcrypt.hash(password, 10);
