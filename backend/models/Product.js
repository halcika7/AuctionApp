const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Product = db.define(
  'Product',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(50),
      validate: {
        notEmpty: true,
        notNull: true
      },
      allowNull: false
    },
    details: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    picture: {
      type: Sequelize.STRING(1024),
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    featured: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    freeShipping: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    auctionStart: {
      type: Sequelize.DATE,
      allowNull: false
    },
    auctionEnd: {
      type: Sequelize.DATE,
      allowNull: false
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
    subcategoryId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'Subcategories'
        },
        key: 'id'
      }
    },
    brandId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'Brands'
        },
        key: 'id'
      }
    }
  },
  {
    sequelize: Sequelize,
    modelName: 'Products',
    timestamps: true
  }
);

module.exports = Product;
