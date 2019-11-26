"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    let brands = [
      {name: "Nike"},
      {name: "Adidas"},
      {name: "Apple"},
      {name: "Rolex"},
      {name: "Levis"},
      {name: "Dell"},
      {name: "Sony"},
      {name: "Samsung"},
      {name: "Ray-Ban"},
      {name: "IKEA"},
      {name: "Nikon"}
    ];
    return queryInterface.bulkInsert("Brands", brands, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Brands", null, {});
  }
};
