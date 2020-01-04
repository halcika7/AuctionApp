'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const option = [
      {
        name: 'Haris Beslic',
        number: '************4242',
        cvc: '****',
        exp_year: 2021,
        exp_month: '02',
        accountId: 'acct_1Fx9zECtXaA8E9y8',
        cardId: 'card_1Fx9zEIsHl6jkvPYyIcZjYRP',
        customerId: 'cus_GU8FO1BPCseETN',
        cardFingerprint: 'Hcc04csiUCOjBQGX'
      }
    ];
    for (let i = 0; i < 50; i++) {
      option.push({
        name: null,
        number: null,
        cvc: null,
        exp_year: null,
        exp_month: null,
        cardId: null,
        customerId: null,
        cardFingerprint: null,
        accountId: null,
      });
    }
    return queryInterface.bulkInsert('CardInfos', option, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CardInfos', null, {});
  }
};
