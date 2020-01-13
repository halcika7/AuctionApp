const router = require('express').Router();
const ProductController = require('../../controllers/ProductController');
const BidController = require('../../controllers/BidController');

// Product Routes
router.get('/:id/:subcategoryId', ProductController.getProduct);
router.get('/similar/:id/:subcategoryId', ProductController.getSimilarProducts);
router.get('/bids/:productId/:subcategoryId', BidController.getProductBids);

module.exports = router;
