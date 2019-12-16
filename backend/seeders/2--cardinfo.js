'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const option = [
      {
        name: null,
        number: null,
        cvc: null,
        exp_year: null,
        exp_month: null,
        cardId: null,
        customerId: null,
        cardFingerprint: null
      }
    ];
    return queryInterface.bulkInsert('CardInfos', option, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CardInfos', null, {});
  }
};
