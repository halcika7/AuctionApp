const Brand = require('./Brand');
const Filter = require('./Filter');
const FilterValue = require('./FilterValue');
const User = require('./User');
const OptionalInfo = require('./OptionalInfo');
const CardInfo = require('./CardInfo');
const Subcategory = require('./Subcategory');
const ProductImage = require('./ProductImage');
const ProductReview = require('./ProductReview');
const Bid = require('./Bid');
const Category = require('./Category');
const Product = require('./Product');

User.belongsTo(OptionalInfo, { foreignKey: 'optionalInfoId', sourceKey: 'id' });
User.belongsTo(CardInfo, { foreignKey: 'cardInfoId', sourceKey: 'id' });

Bid.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });
Bid.belongsTo(Product, { foreignKey: 'productId', sourceKey: 'id' });

Category.hasMany(Subcategory, { foreignKey: 'CategoriesId', sourceKey: 'id' });
Subcategory.belongsTo(Category, {
  foreignKey: 'CategoriesId',
  sourceKey: 'id'
});

Product.hasMany(ProductImage, { foreignKey: 'productId', sourceKey: 'id' });
Product.hasMany(ProductReview, { foreignKey: 'productId', sourceKey: 'id' });
ProductReview.belongsTo(Product, { foreignKey: 'productId', sourceKey: 'id' });
Product.hasMany(Bid, { foreignKey: 'productId', sourceKey: 'id' });

Product.belongsTo(Subcategory, {
  foreignKey: 'subcategoryId',
  sourceKey: 'id'
});
Subcategory.hasMany(Product, {
  foreignKey: 'subcategoryId',
  sourceKey: 'id'
});
Product.belongsTo(Brand, { foreignKey: 'brandId', sourceKey: 'id' });
Brand.hasMany(Product, { foreignKey: 'brandId', sourceKey: 'id' });

Product.belongsToMany(FilterValue, {
  through: 'FilterValueProducts',
  foreignKey: 'productId',
  otherKey: 'filterValueId'
});
FilterValue.belongsToMany(Product, {
  through: 'FilterValueProducts',
  foreignKey: 'filterValueId',
  otherKey: 'productId'
});

Subcategory.belongsToMany(Brand, {
  through: 'BrandSubcategories',
  foreignKey: 'subcategoryId',
  otherKey: 'brandId'
});
Brand.belongsToMany(Subcategory, {
  through: 'BrandSubcategories',
  foreignKey: 'brandId',
  otherKey: 'subcategoryId'
});

Subcategory.belongsToMany(Filter, {
  through: 'FilterSubcategories',
  foreignKey: 'subcategoryId',
  otherKey: 'filterId'
});
Filter.belongsToMany(Subcategory, {
  through: 'FilterSubcategories',
  foreignKey: 'filterId',
  otherKey: 'subcategoryId'
});

Filter.hasMany(FilterValue, {
  foreignKey: 'filterId',
  sourceKey: 'id'
});
