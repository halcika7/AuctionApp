const Sequelize = require('sequelize');
const db = require('../config/database');

const ProductImage = db.define(
    'ProductImage',
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        image: {
            type: Sequelize.STRING(1024),
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
        }
    },
    {
        sequelize: Sequelize,
        modelName: 'ProductImages'
    }
);

ProductImage.associate = function(models) {
    // ProductImage.hasMany(db.ProductImages, { foreignKey: 'productId' });
    ProductImage.hasOne(models.Product);
};

module.exports = ProductImage;
