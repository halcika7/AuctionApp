const Sequelize = require('sequelize');
const { db } = require('../config/database');

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

module.exports = Subcategory;
