const CategoryServiceInstance = require('../services/CategoryService');

class CategoryController {
    constructor() {
        if (!!CategoryController.instance) return CategoryController.instance;
        CategoryController.instance = this;
        return this;
    }

    async categories(req, res) {
        const { categories, failedMessage, status } = await CategoryServiceInstance.categories();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ categories });
    }

    async categoriesSub(req, res) {
        const { categories, failedMessage, status } = await CategoryServiceInstance.categories(true);
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ categories });
    }
}

const CategoryControllerInstance = new CategoryController();

module.exports = CategoryControllerInstance;
