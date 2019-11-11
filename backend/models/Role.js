const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Role = db.define(
    'Role',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        roleName: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize: Sequelize,
        modelName: 'Roles'
    }
);

module.exports = Role;
