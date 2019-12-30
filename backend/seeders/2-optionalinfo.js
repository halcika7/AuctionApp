'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const option = [];
    for (let i = 0; i < 51; i++) {
      option.push({
        street: null,
        city: null,
        zip: null,
        state: null,
        country: null
      });
    }
    return queryInterface.bulkInsert('OptionalInfos', option, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OptionalInfos', null, {});
  }
};
