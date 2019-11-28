const Sequelize = require('sequelize');
const { db } = require('../config/database');

const FilterValueProduct = db.define(
  'FilterValueProducts',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    filterValueId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'FilterValues'
        },
        key: 'id'
      }
    },
    productId: {
      type: Sequelize.BIGINT,
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
    modelName: 'FilterValueProducts',
    indexes: [
      {
        unique: false,
        fields: ['filterValueId']
      }
    ]
  }
);

module.exports = FilterValueProduct;
