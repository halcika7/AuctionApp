const router = require('express').Router();
const ProfileController = require('../../controllers/ProfileController');
const BidController = require('../../controllers/BidController');
const ProductController = require('../../controllers/ProductController');
const WishlistController = require('../../controllers/WishlistController');
const authMiddleware = require('../../middlewares/authMiddleware');
const multer = require('../../config/multerConfig');

// Profile Routes
router.get('/userInfo', authMiddleware, ProfileController.getUserInfo);
router.get('/products', authMiddleware, ProductController.getUserProducts);
router.get('/wishlist', authMiddleware, WishlistController.getUserProfileWishlist);
router.get('/bids', authMiddleware, BidController.getUserBids);
router.put(
  '/updateprofile',
  authMiddleware,
  multer.single('image'),
  ProfileController.updateProfileInfo
);
router.put('/deactivate', authMiddleware, ProfileController.deactivateAccount);

module.exports = router;
