const router = require('express').Router();
const ProductController = require('../../controllers/ProductController');
const CategoryController = require('../../controllers/CategoryController');

// Landing Page Routes
router.get('/featured', ProductController.featuredProducts);
router.get('/featured/:limit', ProductController.featuredProducts);
router.get('/hero', ProductController.heroProduct);
router.get('/lastchance', ProductController.lastChanceProducts);
router.get('/newarrivals', ProductController.newArrivalProducts);
router.get('/toprated', ProductController.topRatedProducts);
router.get('/categories', CategoryController.categories);

module.exports = router;
