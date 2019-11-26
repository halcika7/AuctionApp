"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    let filters = [
      { name: "color" },
      { name: "shoe size" },
      { name: "material" },
      { name: "storage" },
      { name: "display resolution" },
      { name: "ram" },
      { name: "graphic card" },
      { name: "height" },
      { name: "weight" },
      { name: "length" },
      { name: "clothing size" }
    ];
    return queryInterface.bulkInsert("Filters", filters, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Filters", null, {});
  }
};
