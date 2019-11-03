const router = require('express').Router();
const ProductController = require('../../controllers/ProductController');

// Landing Page Routes
router.get('/:type', ProductController.products);

module.exports = router;
