const router = require("express").Router();
const CategoryController = require("../../controllers/CategoryController");

// Categories Routes
router.get("/", CategoryController.getCategories);
router.get("/:shop", CategoryController.getCategories);

module.exports = router;
