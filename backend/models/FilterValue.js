const Sequelize = require('sequelize');
const { db } = require('../config/database');

const FilterValue = db.define(
  'FilterValues',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    filterId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: 'Filters'
        },
        key: 'id'
      }
    },
    value: {
      type: Sequelize.STRING
    }
  },
  {
    sequelize: Sequelize,
    modelName: 'FilterValues'
  }
);

module.exports = FilterValue;
