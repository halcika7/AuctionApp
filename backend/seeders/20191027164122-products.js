'use strict';
const faker = require('faker');

module.exports = {
    up: (queryInterface, Sequelize) => {
        let products = [];

        const helperFunction = (index, j, subcategoryId) => {
            for (let i = index; i < j; i++) {
                let date = new Date();
                let newDate = new Date(date);
                newDate.setDate(newDate.getDate() + faker.random.number(30));
                let startDate = new Date(date);
                startDate.setDate(newDate.getDate() + faker.random.number(4));

                products.push({
                    name: faker.commerce.productName(),
                    details: faker.lorem.paragraph(),
                    picture:
                        'https://www.brownweinraub.com/wp-content/uploads/2017/09/placeholder.jpg',
                    price: faker.commerce.price(),
                    featured: faker.random.boolean(),
                    auctionStart: startDate,
                    auctionEnd: newDate,
                    userId: Math.floor(Math.random() * 100 + 1),
                    subcategoryId
                });
            }
        };
        helperFunction(1, 11, 1);
        helperFunction(11, 21, 2);
        helperFunction(21, 31, 3);
        helperFunction(31, 41, 4);
        helperFunction(41, 51, 5);
        helperFunction(51, 61, 6);
        helperFunction(61, 71, 7);
        helperFunction(71, 81, 8);
        helperFunction(81, 91, 9);
        helperFunction(91, 101, 10);
        helperFunction(101, 111, 11);
        helperFunction(111, 121, 12);
        helperFunction(121, 131, 13);
        helperFunction(131, 141, 14);
        helperFunction(141, 151, 15);
        helperFunction(151, 161, 16);
        helperFunction(161, 171, 17);
        helperFunction(171, 181, 18);
        helperFunction(181, 191, 19);
        helperFunction(191, 201, 20);
        helperFunction(201, 211, 21);
        helperFunction(211, 221, 22);
        helperFunction(221, 231, 23);
        helperFunction(231, 241, 24);
        helperFunction(241, 251, 25);
        helperFunction(251, 261, 26);
        helperFunction(261, 271, 27);
        helperFunction(271, 281, 28);
        return queryInterface.bulkInsert('Products', products, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Products', null, {});
    }
};
