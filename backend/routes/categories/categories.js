const router = require('express').Router();
const CategoryController = require('../../controllers/CategoryController');

// Categories Routes
router.get('/', CategoryController.categoriesSub);

module.exports = router;
