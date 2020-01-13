const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Order = db.define(
  'Order',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    paid: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    freeShipping: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
      allowNull: true,
      defaultValue: null,
      references: {
        model: {
          tableName: 'Users'
        },
        key: 'id'
      }
    },
    shippingFrom: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {
        address: '',
        country: '',
        city: '',
        zipCode: '',
        phone: ''
      }
    },
    shippingTo: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {
        address: '',
        country: '',
        city: '',
        zipCode: '',
        phone: ''
      }
    }
  },
  {
    sequelize: Sequelize,
    modelName: 'Orders'
  }
);

module.exports = Order;
