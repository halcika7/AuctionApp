const router = require('express').Router();
const ShopController = require('../../controllers/ShopController');
const ProductController = require('../../controllers/ProductController');
const BrandController = require('../../controllers/BrandController');
const FilterController = require('../../controllers/FilterController');

// Shop Routes
router.get('/brands', BrandController.getShopBrands);
router.get('/prices', ShopController.getPrices);
router.get('/filters', FilterController.getFilters);
router.get('/products', ProductController.getShopProducts);

module.exports = router;
