const Sequelize = require('sequelize');
const { db } = require('../config/database');

const Category = db.define(
  'Category',
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize: Sequelize,
    modelName: 'Categories'
  }
);

module.exports = Category;
