const router = require('express').Router();
const FilterController = require('../../controllers/FilterController');
const BrandController = require('../../controllers/BrandController');
const CategoryController = require('../../controllers/CategoryController');
const ProductController = require('../../controllers/ProductController');
const ProfileController = require('../../controllers/ProfileController');
const authMiddleware = require('../../middlewares/authMiddleware');
const multer = require('../../config/multerConfig');

// Product Routes
router.post('/addproduct', authMiddleware, multer.array('images'), ProductController.addProduct);
router.get('/optionalinfo', authMiddleware, ProfileController.getUserOptionalInfo);
router.get('/activeproducts', authMiddleware, ProductController.userNumberOfActiveProducts);
router.get('/categories', CategoryController.getOnlyCategories);
router.get('/filters/:id', FilterController.getAddProductFilters);
router.get('/brands/:id', BrandController.getAddProductBrands);
router.get('/subcategories/:id', CategoryController.getSubcategories);

module.exports = router;
