'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FilterValueProducts', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      filterValueId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'FilterValues'
          },
          key: 'id'
        }
      },
      productId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'Products'
          },
          key: 'id'
        }
      }
    }).then(() => queryInterface.addIndex('FilterValueProducts', ['filterValueId']));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FilterValueProducts');
  }
};
