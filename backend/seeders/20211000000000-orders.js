'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let orders = [];
    for (let i = 0; i < 100; i++) {
      orders.push({
        paid: false,
        freeShipping: false,
        ownerId: 1,
        shippingFrom: JSON.stringify({
          address: 'Some address',
          country: 'Bosnia adn Herzegovina',
          city: 'Sarajevo',
          zipCode: '71000',
          phone: '+38761222333'
        })
      });
    }
    return queryInterface.bulkInsert('Orders', orders, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Orders', null, {});
  }
};
