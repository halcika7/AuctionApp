const Sequelize = require("sequelize");
const { db } = require("../config/database");

const FilterSubcategory = db.define(
  "FilterSubcategories",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    filterId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: "Filters"
        },
        key: "id"
      }
    },
    subcategoryId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: "Subcategories"
        },
        key: "id"
      }
    }
  },
  {
    sequelize: Sequelize,
    modelName: "FilterSubcategories"
  }
);

module.exports = FilterSubcategory;
