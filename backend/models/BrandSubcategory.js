const Sequelize = require('sequelize');
const { db } = require('../config/database');

const BrandSubcategory = db.define(
  'BrandSubcategory',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    brandId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'Brands'
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
    modelName: 'BrandSubcategories'
  }
);

module.exports = BrandSubcategory;
