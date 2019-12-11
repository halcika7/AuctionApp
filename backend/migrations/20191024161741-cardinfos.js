'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CardInfos', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      cardName: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null
      },
      cardNumber: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null
      },
      cardCVC: {
        type: Sequelize.STRING(30),
        allowNull: true,
        defaultValue: null
      },
      cardYear: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      cardMonth: {
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CardInfos');
  }
};
