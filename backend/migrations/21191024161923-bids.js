'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('Bids', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        price: {
          type: Sequelize.DOUBLE,
          allowNull: false
        },
        productId: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: {
              tableName: 'Products'
            },
            key: 'id'
          }
        },
        userId: {
          type: Sequelize.BIGINT,
          references: {
            model: {
              tableName: 'Users'
            },
            key: 'id'
          }
        },
        dateBid: {
          type: Sequelize.DATE,
          defaultValue: Date.now()
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW
        }
      })
      .then(() => queryInterface.addIndex('Bids', ['productId']));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Bids');
  }
};
