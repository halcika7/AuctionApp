const Sequelize = require('sequelize');
const { db } = require('../config/database');

const ProductReview = db.define(
    'ProductReview',
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
        productId: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
                model: {
                    tableName: 'Products'
                },
                key: 'id'
            }
        },
        userId: {
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
        modelName: 'ProductReviews'
    }
);

module.exports = ProductReview;
