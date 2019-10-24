'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ProductReviews', {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            rating: {
                type: Sequelize.INTEGER(1),
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
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ProductReviews');
    }
};
