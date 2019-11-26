const router = require("express").Router();
const ShopController = require("../../controllers/ShopController");

// Shop Routes
router.get("/brands", ShopController.getBrands);
router.get("/prices", ShopController.getPrices);
router.get("/filters", ShopController.getFilters);
router.get("/products", ShopController.getProducts);
router.get("/sort", ShopController.sortProducts);
router.get("/loadmore/:offset", ShopController.loadMoreProducts);

module.exports = router;
