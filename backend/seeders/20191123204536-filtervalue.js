"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    let filtervalues = [
      { filterId: 1, value: "white" },// 1
      { filterId: 1, value: "black" },// 2
      { filterId: 1, value: "red" },// 3
      { filterId: 1, value: "green" },// 4
      { filterId: 1, value: "blue" },// 5
      { filterId: 2, value: "30" },// 6
      { filterId: 2, value: "31" },// 7
      { filterId: 2, value: "32" },// 8
      { filterId: 2, value: "33" },// 9
      { filterId: 2, value: "34" },// 10
      { filterId: 2, value: "35" },// 11
      { filterId: 2, value: "36" },// 12
      { filterId: 2, value: "37" },// 13
      { filterId: 2, value: "38" },// 14
      { filterId: 2, value: "39" },// 15
      { filterId: 2, value: "40" },// 16
      { filterId: 2, value: "41" },// 17
      { filterId: 2, value: "42" },// 18
      { filterId: 2, value: "43" },// 19
      { filterId: 2, value: "44" },// 20
      { filterId: 2, value: "45" },// 21
      { filterId: 2, value: "46" },//22
      { filterId: 2, value: "47" },// 23
      { filterId: 2, value: "48" },// 24
      { filterId: 2, value: "49" },// 25
      { filterId: 2, value: "50" },// 26
      { filterId: 3, value: "cotton" },// 27
      { filterId: 3, value: "paper" },// 28
      { filterId: 3, value: "wood" },// 29
      { filterId: 3, value: "steel" },// 30
      { filterId: 3, value: "aluminium" },// 31
      { filterId: 3, value: "leather" },// 32
      { filterId: 3, value: "ceramic" },// 33
      { filterId: 3, value: "silver" },// 34
      { filterId: 3, value: "gold" },// 35
      { filterId: 3, value: "plastic" },// 36
      { filterId: 4, value: "2 GB" },// 37
      { filterId: 4, value: "4 GB" },// 38
      { filterId: 4, value: "8 GB" },// 39
      { filterId: 4, value: "16 GB" },// 40
      { filterId: 4, value: "32 GB" },// 41
      { filterId: 4, value: "64 GB" },// 42
      { filterId: 4, value: "128 GB" },// 43
      { filterId: 4, value: "256 GB" },// 44
      { filterId: 4, value: "512 GB" },// 45
      { filterId: 4, value: "1 TB" },// 46
      { filterId: 4, value: "2 TB" },// 47
      { filterId: 4, value: "3 TB" },// 48
      { filterId: 4, value: "4 TB" },// 49
      { filterId: 4, value: "8 TB" },// 50
      { filterId: 5, value: "HD 1280 x 720" },// 51
      { filterId: 5, value: "HD+ 1600 x 900" },// 52
      { filterId: 5, value: "HD+ 1800 x 900" },// 53
      { filterId: 5, value: "FHD 1920 x 1080" },// 54
      { filterId: 5, value: "(W)QHD 2560 x 1440" },// 55
      { filterId: 5, value: "QHD+ 3200 x 1800" },// 56
      { filterId: 5, value: "4K UHD 3840 x 2160" },// 57
      { filterId: 5, value: "5K 5120 x 2880" },// 58
      { filterId: 5, value: "8K UHD 7680 x 4320" },// 59
      { filterId: 6, value: "1 GB" },// 60
      { filterId: 6, value: "2 GB" },// 61
      { filterId: 6, value: "4 GB" },// 62
      { filterId: 6, value: "6 GB" },// 63
      { filterId: 6, value: "8 GB" },// 64
      { filterId: 6, value: "12 GB" },// 65
      { filterId: 6, value: "16 GB" },// 66
      { filterId: 6, value: "24 GB" },// 67
      { filterId: 6, value: "32 GB" },// 68
      { filterId: 6, value: "64 GB" },// 69
      { filterId: 6, value: "128 GB" },// 70
      { filterId: 6, value: "256 GB" },// 71
      { filterId: 7, value: "1 GB" },// 72
      { filterId: 7, value: "2 GB" },// 73
      { filterId: 7, value: "4 GB" },// 74
      { filterId: 7, value: "6 GB" },// 75
      { filterId: 7, value: "8 GB" },// 76
      { filterId: 7, value: "12 GB" },// 77
      { filterId: 7, value: "16 GB" },// 78
      { filterId: 7, value: "24 GB" },// 79
      { filterId: 7, value: "32 GB" },// 80
      { filterId: 7, value: "64 GB" },// 81
      { filterId: 7, value: "128 GB" },// 82
      { filterId: 7, value: "256 GB" },// 83
      { filterId: 8, value: "50 cm" },// 84
      { filterId: 8, value: "100 cm" },// 85
      { filterId: 8, value: "200 cm" },// 86
      { filterId: 9, value: "0.5 KG" },// 87
      { filterId: 9, value: "1 KG" },// 88
      { filterId: 9, value: "2 KG" },// 89
      { filterId: 10, value: "10 cm" },// 90
      { filterId: 10, value: "20 cm" },// 91
      { filterId: 10, value: "30 cm" },// 92
      { filterId: 10, value: "40 cm" },// 93
      { filterId: 10, value: "50 cm" },// 94
      { filterId: 11, value: "XXS" },// 95
      { filterId: 11, value: "XS" },// 96
      { filterId: 11, value: "S" },// 97
      { filterId: 11, value: "M" },// 98
      { filterId: 11, value: "L" },// 99
      { filterId: 11, value: "XL" },// 100
      { filterId: 11, value: "XXL" },// 101
      { filterId: 11, value: "XXXL" } // 102
    ];
    return queryInterface.bulkInsert("FilterValues", filtervalues, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("FilterValues", null, {});
  }
};
