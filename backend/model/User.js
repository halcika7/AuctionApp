const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define(
    'User',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING(50),
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true,
                notNull: true
            },
            allowNull: false
        },
        firstName: {
            type: Sequelize.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: true
            }
        },
        lastName: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: true
            }
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
    },
    {
        sequelize: Sequelize,
        modelName: 'Users'
    }
);

module.exports = User;
