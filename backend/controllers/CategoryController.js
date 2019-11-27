const CategoryServiceInstance = require("../services/CategoryService");
const BaseController = require("./BaseController");

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
    return super.sendResponseWithMessage(res, status, { categories }, failedMessage);
  }
}

const CategoryControllerInstance = new CategoryController();

module.exports = CategoryControllerInstance;
