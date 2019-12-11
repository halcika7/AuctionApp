const router = require('express').Router();
const ProductController = require('../../controllers/ProductController');

// Landing Page Routes
router.get('/:type/:limit', ProductController.getProducts);
router.get('/:type/:limit/:offset', ProductController.getProducts);

module.exports = router;
