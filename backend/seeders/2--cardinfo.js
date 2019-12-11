'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const option = [];
    for(let i = 0; i < 102; i++) {
        option.push({
            cardName: null,
            cardNumber: null,
            cardCVC: null,
            cardYear: null,
            cardMonth: null,
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
