'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let reviews = [];

    for (let i = 0; i < 5000; i++) {
      reviews.push({
        rating: Math.floor(Math.random() * 5 + 1),
        productId: Math.floor(Math.random() * 100 + 1),
        userId: Math.floor(Math.random() * 100 + 1)
      });
    }
    return queryInterface.bulkInsert('ProductReviews', reviews, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('ProductReviews', null, {});
  }
};
