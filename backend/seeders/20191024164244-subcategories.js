"use strict";
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const fashionSubcategories = ["Jeans", "Vintage"];
    const accessoriesSub = ["Women's Accessories"];
    const jewelrySub = ["Wristwatches"];
    const shoesSubcategories = ["Sneakers"];
    const sportwareSubcategories = ["Sweatshirts"];
    const homeSubcategories = ["Lamps"];
    const electronicsSubcategories = ["Camera"];
    const mobileSUbcategories = ["Phones"];
    const computerSubcategories = ["Laptops"];
    let subcategories = [];

    const helperFunction = (arr, CategoriesId) => {
      for (let i = 0; i < arr.length; i++) {
        subcategories.push({
          name: arr[i],
          CategoriesId
        });
      }
    };
    helperFunction(fashionSubcategories, 1);
    helperFunction(accessoriesSub, 2);
    helperFunction(jewelrySub, 3);
    helperFunction(shoesSubcategories, 4);
    helperFunction(sportwareSubcategories, 5);
    helperFunction(homeSubcategories, 6);
    helperFunction(electronicsSubcategories, 7);
    helperFunction(mobileSUbcategories, 8);
    helperFunction(computerSubcategories, 9);

    return queryInterface.bulkInsert("Subcategories", subcategories, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Subcategories", null, {});
  }
};
