'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const option = [];
    for(let i = 0; i < 102; i++) {
        option.push({
            name: null,
            number: null,
            cvc: null,
            exp_year: null,
            exp_month: null,
            cardToken: null,
            cardFingerprint: null
        });
    }
    return queryInterface.bulkInsert('CardInfos', option, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CardInfos', null, {});
  }
};
