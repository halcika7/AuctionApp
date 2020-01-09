const router = require('express').Router();
const PaymentController = require('../../controllers/PaymentController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Payment Routes
router.post('/checkuservalidity', authMiddleware, PaymentController.validateUser);
router.post('/makepayment', authMiddleware, PaymentController.payOrder);
router.get('/ownerinfo/:id/:subcategoryId', authMiddleware, PaymentController.getOwnerInfo);

module.exports = router;
