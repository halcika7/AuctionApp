const router = require('express').Router();
const ProfileController = require('../../controllers/ProfileController');
const BidController = require('../../controllers/BidController');
const ProductController = require('../../controllers/ProductController');
const authMiddleware = require('../../middlewares/authMiddleware');
const fs = require('fs');
const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let directory = `./backend/images/`;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    cb(null, directory);
  },
  filename: (req, file, cb) => {
    let fileName = `user-${req.userId}.${file.mimetype.slice(6)}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const multerProfilePicture = multer({
  storage: fileStorage,
  fileFilter
});

// Profile Routes
router.get('/userInfo', authMiddleware, ProfileController.getUserInfo);
router.get('/products', authMiddleware, ProductController.getUserProducts);
router.get('/bids', authMiddleware, BidController.getUserBids);
router.put(
  '/updateprofile',
  authMiddleware,
  multerProfilePicture.single('image'),
  ProfileController.updateProfileInfo
);
router.put('/deactivate', authMiddleware, ProfileController.deactivateAccount);

module.exports = router;