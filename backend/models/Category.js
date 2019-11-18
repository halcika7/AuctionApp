const Sequelize = require("sequelize");
const { db } = require("../config/database");
const Subcategory = require("./Subcategory");

const Category = db.define(
  "Category",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    }
  },
  {
    sequelize: Sequelize,
    modelName: "Categories"
  }
);

Category.hasMany(Subcategory, { foreignKey: "CategoriesId", sourceKey: "id" });
Subcategory.belongsTo(Category, {
  foreignKey: "CategoriesId",
  sourceKey: "id"
});

module.exports = Category;
