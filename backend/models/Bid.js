const Sequelize = require('sequelize');
const { db } = require('../config/database');
const User = require('./User');

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
        userId: {
            type: Sequelize.BIGINT,
            references: {
                model: {
                    tableName: 'Users'
                },
                key: 'id'
            }
        },
        dateBid: {
            type: Sequelize.DATE,
            defaultValue: Date.now()
        }
    },
    {
        sequelize: Sequelize,
        modelName: 'Bids'
    }
);

Bid.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });

module.exports = Bid;
