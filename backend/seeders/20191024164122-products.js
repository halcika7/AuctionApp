'use strict';
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    let products = [];

    for(let i = 0; i < 200; i++) {
      let date = new Date();
      let newDate = new Date(date);
      newDate.setDate(newDate.getDate() + faker.random.number(30));

      products.push({
        name: faker.commerce.productName(),
        details: faker.lorem.paragraph(),
        picture: faker.image.imageUrl(),
        price: faker.commerce.price(),
        featured: faker.random.boolean(),
        auctionStart: date,
        auctionEnd: newDate,
        userId: Math.floor(Math.random() * 100 + 1)
      });
    }
    return queryInterface.bulkInsert('Products', products, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
