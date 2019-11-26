const Sequelize = require("sequelize");
const { db } = require("../config/database");
const ProductImage = require("./ProductImage");
const ProductReview = require("./ProductReview");
const Subcategory = require("./Subcategory");
const Bid = require("./Bid");
const Brand = require("./Brand");
const FilterValue = require("./FilterValue");

const Product = db.define(
  "Product",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(50),
      validate: {
        notEmpty: true,
        notNull: true
      },
      allowNull: false
    },
    details: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    picture: {
      type: Sequelize.STRING(1024),
      allowNull: false
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false
    },
    featured: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    auctionStart: {
      type: Sequelize.DATE,
      allowNull: false
    },
    auctionEnd: {
      type: Sequelize.DATE,
      allowNull: false
    },
    userId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: "Users"
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
    },
    brandId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: "Brands"
        },
        key: "id"
      }
    }
  },
  {
    sequelize: Sequelize,
    modelName: "Products"
  }
);

Product.hasMany(ProductImage, { foreignKey: "productId", sourceKey: "id" });
Product.hasMany(ProductReview, { foreignKey: "productId", sourceKey: "id" });
ProductReview.belongsTo(Product, { foreignKey: "productId", sourceKey: "id" });
Product.hasMany(Bid, { foreignKey: "productId", sourceKey: "id" });

Product.belongsTo(Subcategory, {
  foreignKey: "subcategoryId",
  sourceKey: "id"
});
Subcategory.hasMany(Product, {
  foreignKey: "subcategoryId",
  sourceKey: "id"
});
Product.belongsTo(Brand, { foreignKey: "brandId", sourceKey: "id" });
Brand.hasMany(Product, { foreignKey: "brandId", sourceKey: "id" });

Product.belongsToMany(FilterValue, {
  through: "FilterValueProducts",
  foreignKey: "productId",
  otherKey: "filterValueId"
});
FilterValue.belongsToMany(Product, {
  through: "FilterValueProducts",
  foreignKey: "filterValueId",
  otherKey: "productId"
});

module.exports = Product;
