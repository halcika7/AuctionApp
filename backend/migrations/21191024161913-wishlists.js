"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Wishlists", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: {
            tableName: "Users"
          },
          key: "id"
        }
      },
      productId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: "Products"
          },
          key: "id"
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Wishlists");
  }
};
