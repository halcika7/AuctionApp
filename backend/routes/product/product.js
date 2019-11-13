const router = require("express").Router();
const ProductController = require("../../controllers/ProductController");

// Product Routes
router.get("/:id", ProductController.getProduct);
router.get("/:id/:subcategoryId", ProductController.getSimilarProducts);

module.exports = router;
