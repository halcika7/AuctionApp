'use strict';
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let users = [];
    for(let i = 0; i<=100; i++) {
      users.push({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '$2a$10$EvaQJZf.TU7POOzXv.n69.xbrtamfBQU5GAx/rfm86JftI6jlFk9m'
      })
    }
    return queryInterface.bulkInsert('users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
