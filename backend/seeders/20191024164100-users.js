'use strict';
const faker = require('faker');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let usrs = [];
        for (let i = 0; i < 100; i++) {
            usrs.push({
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                photo: 'https://static.thenounproject.com/png/363633-200.png',
                password: '$2a$10$EvaQJZf.TU7POOzXv.n69.xbrtamfBQU5GAx/rfm86JftI6jlFk9m',
                roleId: Math.floor(Math.random() * 2 + 1)
            });
        }
        return queryInterface.bulkInsert('Users', usrs, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};
