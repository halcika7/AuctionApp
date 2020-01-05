'use strict';
const fs = require('fs');
const data = fs.readFileSync('./userData.json');
const jsonParsed = JSON.parse(data);

module.exports = {
  up: (queryInterface, Sequelize) => {
    fs.unlinkSync('./userData.json');

    return queryInterface.bulkInsert('Users', jsonParsed.userData, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
