const Sequelize = require('sequelize');
const db = require('../config/database');

const OptionalInfo = db.define(
    'OptionalInfo',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        street: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        city: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        zip: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        state: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        country: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    },
    {
        sequelize: Sequelize,
        modelName: 'OptionalInfos'
    }
);

module.exports = OptionalInfo;
