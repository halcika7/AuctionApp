'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        let psub = [];
        for (let i = 0; i < 100; i++) {
            psub.push({
                productId: Math.floor(Math.random() * 200 + 1),
                subcategoryId: Math.floor(Math.random() * 100 + 1)
            });
        }
        return queryInterface.bulkInsert('Product_Subcategories', psub, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Product_Subcategories', null, {});
    }
};
