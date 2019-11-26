"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    let brandsubs = [
      { brandId: 1, subcategoryId: 5 },
      { brandId: 1, subcategoryId: 6 },
      { brandId: 2, subcategoryId: 5 },
      { brandId: 2, subcategoryId: 6 },
      { brandId: 3, subcategoryId: 4 },
      { brandId: 3, subcategoryId: 9 },
      { brandId: 3, subcategoryId: 10 },
      { brandId: 4, subcategoryId: 4 },
      { brandId: 5, subcategoryId: 1 },
      { brandId: 5, subcategoryId: 2 },
      { brandId: 5, subcategoryId: 5 },
      { brandId: 5, subcategoryId: 6 },
      { brandId: 6, subcategoryId: 10 },
      { brandId: 7, subcategoryId: 8 },
      { brandId: 7, subcategoryId: 9 },
      { brandId: 7, subcategoryId: 10 },
      { brandId: 8, subcategoryId: 8 },
      { brandId: 8, subcategoryId: 9 },
      { brandId: 8, subcategoryId: 10 },
      { brandId: 9, subcategoryId: 3 },
      { brandId: 10, subcategoryId: 7 },
      { brandId: 11, subcategoryId: 8 }
    ];
    return queryInterface.bulkInsert("BrandSubcategories", brandsubs, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("BrandSubcategories", null, {});
  }
};
