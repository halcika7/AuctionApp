'use strict';
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let usrs = [
      {
        firstName: 'Haris',
        lastName: 'Beslic2',
        email: 'harisbeslic32@gmail.com',
        photo: 'https://static.thenounproject.com/png/363633-200.png',
        password: '$2a$10$EvaQJZf.TU7POOzXv.n69.xbrtamfBQU5GAx/rfm86JftI6jlFk9m',
        roleId: Math.floor(Math.random() * 2 + 1),
        optionalInfoId: 1,
        cardInfoId: 1
      }
    ];
    return queryInterface.bulkInsert('Users', usrs, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
