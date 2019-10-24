'use strict';
const faker = require('faker');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let subcategories = [];
        for (let i = 0; i < 100; i++) {
            subcategories.push({
                name: faker.random.word() + Math.random(),
                CategoriesId: Math.floor(Math.random() * 9 + 1)
            });
        }
        return queryInterface.bulkInsert('Subcategories', subcategories, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Subcategories', null, {});
    }
};
