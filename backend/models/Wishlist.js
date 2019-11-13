const Sequelize = require("sequelize");
const { db } = require("../config/database");

const Wishlist = db.define(
  "Wishlist",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: {
        model: {
          tableName: "Users"
        },
        key: "id"
      }
    },
    productId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: "Products"
        },
        key: "id"
      }
    }
  },
  {
    sequelize: Sequelize,
    modelName: "Wishlists"
  }
);

module.exports = Wishlist;
