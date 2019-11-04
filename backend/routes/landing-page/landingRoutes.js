const router = require('express').Router();
const ProductController = require('../../controllers/ProductController');

// Landing Page Routes
router.get('/:type/:limit', ProductController.products);
router.get('/:type/:limit/:offset', ProductController.products);

module.exports = router;
