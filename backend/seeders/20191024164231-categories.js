'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const gg = [
      'Fashion',
      'Video Games',
      'Jewlery',
      'Shoes',
      'Sportware',
      'Electronics',
      'Home',
      'Mobile',
      'Computer'
  ];

  let ctgs = [];
  for (let i = 0; i < gg.length; i++) {
      ctgs.push({
          name: gg[i]
      });
  }
    return queryInterface.bulkInsert('Categories',ctgs, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
