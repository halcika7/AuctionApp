'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BrandSubcategories', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      brandId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'Brands'
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
    return queryInterface.dropTable('BrandSubcategories');
  }
};
