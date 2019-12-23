const router = require('express').Router();
const WishlistController = require('../../controllers/WishlistController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Wishlist Routes
router.get('/userwishlistids', authMiddleware, WishlistController.getUserWishlistIds);
router.post('/addtowishlist', authMiddleware, WishlistController.addToWishlist);
router.delete('/removefromwishlist', authMiddleware, WishlistController.removeFromWishlist);

module.exports = router;
