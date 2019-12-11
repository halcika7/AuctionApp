'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let filtersubcategories = [
      { filterId: 1, subcategoryId: 1 },
      { filterId: 3, subcategoryId: 1 },
      { filterId: 1, subcategoryId: 2 },
      { filterId: 3, subcategoryId: 2 },
      { filterId: 1, subcategoryId: 3 },
      { filterId: 3, subcategoryId: 3 },
      { filterId: 1, subcategoryId: 4 },
      { filterId: 3, subcategoryId: 4 },
      { filterId: 1, subcategoryId: 5 },
      { filterId: 2, subcategoryId: 5 },
      { filterId: 3, subcategoryId: 5 },
      { filterId: 1, subcategoryId: 6 },
      { filterId: 3, subcategoryId: 6 },
      { filterId: 11, subcategoryId: 6 },
      { filterId: 1, subcategoryId: 7 },
      { filterId: 3, subcategoryId: 7 },
      { filterId: 8, subcategoryId: 7 },
      { filterId: 9, subcategoryId: 7 },
      { filterId: 1, subcategoryId: 8 },
      { filterId: 3, subcategoryId: 8 },
      { filterId: 4, subcategoryId: 8 },
      { filterId: 9, subcategoryId: 8 },
      { filterId: 1, subcategoryId: 9 },
      { filterId: 3, subcategoryId: 9 },
      { filterId: 4, subcategoryId: 9 },
      { filterId: 6, subcategoryId: 9 },
      { filterId: 9, subcategoryId: 9 },
      { filterId: 1, subcategoryId: 10 },
      { filterId: 3, subcategoryId: 10 },
      { filterId: 5, subcategoryId: 10 },
      { filterId: 6, subcategoryId: 10 },
      { filterId: 7, subcategoryId: 10 },
      { filterId: 9, subcategoryId: 10 }
    ];
    return queryInterface.bulkInsert('FilterSubcategories', filtersubcategories, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('FilterSubcategories', null, {});
  }
};
