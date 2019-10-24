'use strict';
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let images = [];

    for(let i = 0; i < 1000; i++) {
      images.push({
        image: faker.image.imageUrl(),
        productId: Math.floor(Math.random() * 100 + 1)
      })
    }

    return queryInterface.bulkInsert('ProductImages', images, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ProductImages', null, {});
  }
};
