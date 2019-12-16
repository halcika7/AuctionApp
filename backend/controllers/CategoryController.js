const CategoryServiceInstance = require('../services/CategoryService');
const BaseController = require('./BaseController');

class CategoryController extends BaseController {
  constructor() {
    super(CategoryController);
  }

  async getCategories(req, res) {
    const { categories, failedMessage, status } = !req.params.shop
      ? await CategoryServiceInstance.getCategoriesWithSubcategories()
      : await CategoryServiceInstance.getShopCategories();
    return super.sendResponseWithMessage(res, status, { categories }, failedMessage);
  }

  async getOnlyCategories(req, res) {
    const { status, categories, message } = await CategoryServiceInstance.getCategories();
    return super.sendResponseWithMessage(res, status, { categories }, message);
  }

  async getSubcategories(req, res) {
    const {
      status,
      subcategories,
      message
    } = await CategoryServiceInstance.getCategorySubcategories(req.params.id);
    return super.sendResponseWithMessage(res, status, { subcategories }, message);
  }
}

const CategoryControllerInstance = new CategoryController();

module.exports = CategoryControllerInstance;
