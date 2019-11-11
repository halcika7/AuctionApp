const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Bid = db.define(
    'Bid',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        price: {
            type: Sequelize.DOUBLE,
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
        ownerId: {
            type: Sequelize.BIGINT,
            references: {
                model: {
                    tableName: 'Users'
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
        modelName: 'Bids'
    }
);

module.exports = Bid;
