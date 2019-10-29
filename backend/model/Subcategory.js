const Sequelize = require('sequelize');
const db = require('../config/database');

const Subcategory = db.define(
    'Subcategory',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        CategoriesId: {
            type: Sequelize.BIGINT,
            references: {
                model: {
                    tableName: 'Categories'
                },
                key: 'id'
            }
        }
    },
    {
        sequelize: Sequelize,
        modelName: 'Subcategories'
    }
);

Subcategory.associate = function(models) {
    Subcategory.belongsToMany(models.Product, {
        through: 'Product_Subcategorys',
        as: 'product_subcategories',
        foreignKey: 'subcategoryId',
        otherKey: 'productId'
    });
};

module.exports = Subcategory;
