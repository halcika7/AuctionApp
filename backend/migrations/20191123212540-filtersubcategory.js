'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('FilterSubcategories', {
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
      subcategoryId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'Subcategories'
          },
          key: 'id'
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('FilterSubcategories');
  }
};
