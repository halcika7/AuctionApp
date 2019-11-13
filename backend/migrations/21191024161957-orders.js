"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Orders", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      paid: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      shipped: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      received: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      productId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "Products"
          },
          key: "id"
        }
      },
      ownerId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: "Users"
          },
          key: "id"
        }
      },
      userId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: "Users"
          },
          key: "id"
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Orders");
  }
};
