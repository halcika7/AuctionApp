'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CardInfos', {
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
      customerId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      cardId: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      cardFingerprint: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CardInfos');
  }
};
