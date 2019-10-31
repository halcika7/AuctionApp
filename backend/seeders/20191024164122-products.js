'use strict';
const faker = require('faker');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let products = [];

        for (let i = 0; i < 280; i++) {
            let date = new Date();
            let newDate = new Date(date);
            newDate.setDate(newDate.getDate() + faker.random.number(30));
            let startDate = new Date(date);
            startDate.setDate(newDate.getDate() + faker.random.number(4));

            products.push({
                name: faker.commerce.productName(),
                details: faker.lorem.paragraph(),
                picture: 'https://www.brownweinraub.com/wp-content/uploads/2017/09/placeholder.jpg',
                price: faker.commerce.price(),
                featured: faker.random.boolean(),
                auctionStart: startDate,
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
