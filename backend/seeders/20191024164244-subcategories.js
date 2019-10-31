'use strict';
const faker = require('faker');

module.exports = {
    up: (queryInterface, Sequelize) => {
        const fasionSUbcategories = ['Clearance', 'Vintage', 'Costumes'];
        const gamesSub = ['Games', 'Parts and Accessories'];
        const jewlerySub = ['Bracelets', 'Rings', 'Wristwatches'];
        const shoesSubcategories = ['Boots', 'Shoes', 'Slippers', 'Sneakers'];
        const sportwareSubcategories = ['Track suit', 'Sweatshirts'];
        const electronicsSubcategories = ['Audio', 'Video', 'Camera', 'Wireles'];
        const homeSubcategories = ['Furniture', 'Lamps', 'Security Devices'];
        const mobileSUbcategories = ['Parts', 'Phones', 'Tablets', 'Smartwatch'];
        const computerSubcategories = ['Hardware', 'Software', 'Instruction'];
        let subcategories = [];

        const helperFunction = (arr, CategoriesId) => {
            for (let i = 0; i < arr.length; i++) {
                subcategories.push({
                    name: arr[i],
                    CategoriesId
                });
            }
        }
        helperFunction(fasionSUbcategories, 1)
        helperFunction(gamesSub, 2)
        helperFunction(jewlerySub, 3)
        helperFunction(shoesSubcategories, 4)
        helperFunction(sportwareSubcategories, 5)
        helperFunction(electronicsSubcategories, 6)
        helperFunction(homeSubcategories, 7)
        helperFunction(mobileSUbcategories, 8)
        helperFunction(computerSubcategories, 9)

        return queryInterface.bulkInsert('Subcategories', subcategories, {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Subcategories', null, {});
    }
};
