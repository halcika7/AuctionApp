const Sequelize = require('sequelize');
const db = require('../config/database');

const Product_Subcategory = db.define(
    'Product_Subcategory',
    {
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
        subcategoryId: {
            type: Sequelize.BIGINT,
            references: {
                model: {
                    tableName: 'Subcategories'
                },
                key: 'id'
            }
        }
    },
    {
        sequelize: Sequelize,
        modelName: 'Product_Subcategories'
    }
);

module.exports = Product_Subcategory;
