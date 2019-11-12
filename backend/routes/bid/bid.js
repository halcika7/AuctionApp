const router = require('express').Router();
const BidController = require('../../controllers/BidController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Categories Routes
router.post('/make', authMiddleware, BidController.makeBid);

module.exports = router;
