const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Filter = db.define(
  'Filter',
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
    modelName: 'Filters'
  }
);

module.exports = Filter;
