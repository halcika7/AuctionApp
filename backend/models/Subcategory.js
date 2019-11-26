const Sequelize = require("sequelize");
const { db } = require("../config/database");
const Brand = require("./Brand");
const Filter = require("./Filter");
const FilterValue = require("./FilterValue");

const Subcategory = db.define(
  "Subcategory",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    CategoriesId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: "Categories"
        },
        key: "id"
      }
    }
  },
  {
    sequelize: Sequelize,
    modelName: "Subcategories"
  }
);

Subcategory.belongsToMany(Brand, {
  through: "BrandSubcategories",
  foreignKey: "subcategoryId",
  otherKey: "brandId"
});
Brand.belongsToMany(Subcategory, {
  through: "BrandSubcategories",
  foreignKey: "brandId",
  otherKey: "subcategoryId"
});

Subcategory.belongsToMany(Filter, {
  through: "FilterSubcategories",
  foreignKey: "subcategoryId",
  otherKey: "filterId"
});
Filter.belongsToMany(Subcategory, {
  through: "FilterSubcategories",
  foreignKey: "filterId",
  otherKey: "subcategoryId"
});

Filter.hasMany(FilterValue, {
  foreignKey: "filterId",
  sourceKey: "id"
});

module.exports = Subcategory;
