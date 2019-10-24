'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Product_Subcategories', {
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
        return queryInterface.dropTable('Product_Subcategories');
    }
};
