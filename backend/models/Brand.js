const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Brand = db.define(
  'Brand',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      unique: true
    }
  },
  {
    sequelize: Sequelize,
    modelName: 'Brands'
  }
);

module.exports = Brand;
