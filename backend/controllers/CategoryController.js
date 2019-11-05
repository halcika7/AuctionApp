const CategoryServiceInstance = require('../services/CategoryService');
const BaseController = require('./BaseController');

class CategoryController extends BaseController {
    constructor() {
        super(CategoryController);
    }

    async getCategories(req, res) {
        const {
            categories,
            failedMessage,
            status
        } = await CategoryServiceInstance.getCategoriesWithSubcategories();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ categories });
    }
}

const CategoryControllerInstance = new CategoryController();

module.exports = CategoryControllerInstance;
