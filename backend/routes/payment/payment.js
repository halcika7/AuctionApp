const router = require('express').Router();
const PaymentController = require('../../controllers/PaymentController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Payment Routes
router.post('/checkuservalidity', authMiddleware, PaymentController.validateUser);
router.post('/makepayment', authMiddleware, PaymentController.payOrder);

module.exports = router;
