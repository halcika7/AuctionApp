const Sequelize = require('sequelize');
const { db } = require('../config/database');

const CardInfo = db.define(
  'CardInfo',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null
    },
    number: {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null
    },
    cvc: {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null
    },
    exp_year: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    exp_month: {
      type: Sequelize.STRING(30),
      allowNull: true,
      defaultValue: null
    },
    cardToken: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    cardFingerprint: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize: Sequelize,
    modelName: 'CardInfos',
    indexes: [
      {
        unique: false,
        fields: ['id', 'cardFingerprint']
      }
    ]
  }
);

module.exports = CardInfo;
