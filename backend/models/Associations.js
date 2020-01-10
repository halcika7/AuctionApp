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
const Wishlist = require('./Wishlist');
const Order = require('./Order');
const Review = require('./Review');

// User associations
User.belongsTo(OptionalInfo, { foreignKey: 'optionalInfoId', sourceKey: 'id' });
User.belongsTo(CardInfo, { foreignKey: 'cardInfoId', sourceKey: 'id' });
User.hasMany(Review, { foreignKey: 'ownerId', sourceKey: 'id' });

// Product associations
Product.hasMany(ProductImage, { foreignKey: 'productId', sourceKey: 'id' });
Product.hasMany(ProductReview, { foreignKey: 'productId', sourceKey: 'id' });
Product.hasMany(Bid, { foreignKey: 'productId', sourceKey: 'id' });
Product.belongsTo(Brand, { foreignKey: 'brandId', sourceKey: 'id' });
Product.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });
Product.belongsTo(Order, { foreignKey: 'orderId', sourceKey: 'id' });
Product.belongsTo(Subcategory, {
  foreignKey: 'subcategoryId',
  sourceKey: 'id'
});
Product.belongsToMany(FilterValue, {
  through: 'FilterValueProducts',
  foreignKey: 'productId',
  otherKey: 'filterValueId'
});

// Bid associations
Bid.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });
Bid.belongsTo(Product, { foreignKey: 'productId', sourceKey: 'id' });

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });
Wishlist.belongsTo(Product, { foreignKey: 'productId', sourceKey: 'id' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });
Review.belongsTo(User, { foreignKey: 'ownerId', sourceKey: 'id' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });
Order.belongsTo(User, { foreignKey: 'ownerId', sourceKey: 'id' });

// Brand associations
Brand.hasMany(Product, { foreignKey: 'brandId', sourceKey: 'id' });
Brand.belongsToMany(Subcategory, {
  through: 'BrandSubcategories',
  foreignKey: 'brandId',
  otherKey: 'subcategoryId'
});

// Product review associations
ProductReview.belongsTo(Product, { foreignKey: 'productId', sourceKey: 'id' });

//Category associations
Category.hasMany(Subcategory, { foreignKey: 'CategoriesId', sourceKey: 'id' });

// Subcategory associations
Subcategory.belongsTo(Category, {
  foreignKey: 'CategoriesId',
  sourceKey: 'id'
});
Subcategory.hasMany(Product, {
  foreignKey: 'subcategoryId',
  sourceKey: 'id'
});
Subcategory.belongsToMany(Brand, {
  through: 'BrandSubcategories',
  foreignKey: 'subcategoryId',
  otherKey: 'brandId'
});
Subcategory.belongsToMany(Filter, {
  through: 'FilterSubcategories',
  foreignKey: 'subcategoryId',
  otherKey: 'filterId'
});

// Filter associations
Filter.belongsToMany(Subcategory, {
  through: 'FilterSubcategories',
  foreignKey: 'filterId',
  otherKey: 'subcategoryId'
});
Filter.hasMany(FilterValue, {
  foreignKey: 'filterId',
  sourceKey: 'id'
});

// Filter value associations
FilterValue.belongsToMany(Product, {
  through: 'FilterValueProducts',
  foreignKey: 'filterValueId',
  otherKey: 'productId'
});
