const router = require('express').Router();
const ProductController = require('../../controllers/ProductController');
const CategoryController = require('../../controllers/CategoryController');

// Landing Page Routes
router.get('/featuredP', ProductController.featuredProducts);
router.get('/featuredC', ProductController.featuredCollections);
router.get('/hero', ProductController.heroProduct);
router.get('/lastchance', ProductController.lastChanceProducts);
router.get('/newarrivals', ProductController.newArrivalProducts);
router.get('/toprated', ProductController.topRatedProducts);
router.get('/categories', CategoryController.categories);

module.exports = router;
