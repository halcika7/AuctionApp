'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Filters', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        unique: true
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Filters');
  }
};
