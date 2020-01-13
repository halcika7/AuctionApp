'use strict';
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let users = [
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
    for(let i = 2; i < 52; i++) {
      users.push({
        firstName: 'Semir',
        lastName: 'lastname',
        email: `sema${i-1}@gmail.com`,
        photo: 'https://static.thenounproject.com/png/363633-200.png',
        password: '$2a$10$9DXn5n4Q.0ZyYQm6uMWr0OVtKzagWH41PWAfWvgncMV3l/Q9QSGNu',
        roleId: Math.floor(Math.random() * 2 + 1),
        optionalInfoId: i,
        cardInfoId: i
      });
    }
    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
