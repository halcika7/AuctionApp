const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('users', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false
    },
    firstName: {
        type: Sequelize.STRING(100)
    },
    lastName: {
        type: Sequelize.STRING(100)
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING(255)
    },
    gender: {
        type: Sequelize.CHAR(6)
    },
    phoneNumber: {
        type: Sequelize.STRING(20)
    },
    seller: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: Sequelize,
    modelName: 'User'
});

module.exports = User;
