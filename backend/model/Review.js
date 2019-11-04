const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Review = db.define(
    'Review',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        rating: {
            type: Sequelize.SMALLINT,
            allowNull: false
        },
        userId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: {
                    tableName: 'Users'
                },
                key: 'id'
            }
        },
        ownerId: {
            type: Sequelize.BIGINT,
            references: {
                model: {
                    tableName: 'Users'
                },
                key: 'id'
            }
        }
    },
    {
        sequelize: Sequelize,
        modelName: 'Reviews'
    }
);

module.exports = Review;
