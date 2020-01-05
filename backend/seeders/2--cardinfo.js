'use strict';
const fs = require('fs');
const data = fs.readFileSync('./cardInfoData.json');
const jsonParsed = JSON.parse(data);

module.exports = {
  up: (queryInterface, Sequelize) => {
    fs.unlinkSync('./cardInfoData.json');
    
    return queryInterface.bulkInsert('CardInfos', jsonParsed.cardInfoData, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CardInfos', null, {});
  }
};
