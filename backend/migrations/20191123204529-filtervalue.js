"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("FilterValues", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      filterId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: "Filters"
          },
          key: "id"
        }
      },
      value: {
        type: Sequelize.STRING
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("FilterValues");
  }
};
