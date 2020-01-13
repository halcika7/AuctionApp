'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let reviews = [];
    for (let i = 0; i < 47; i++) {
      reviews.push({
        rating: Math.floor(Math.random() * 5 + 1),
        ownerId: 1,
        userId: i + 2
      });
    }
    return queryInterface.bulkInsert('Reviews', reviews, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
