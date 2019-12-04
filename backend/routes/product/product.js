const router = require('express').Router();
const ProductController = require('../../controllers/ProductController');

// Product Routes
router.get('/:id/:subcategoryId', ProductController.getProduct);
router.get('/similar/:id/:subcategoryId', ProductController.getSimilarProducts);

module.exports = router;
