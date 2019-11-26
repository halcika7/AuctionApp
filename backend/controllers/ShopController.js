const ShopServiceInstance = require('../services/ShopService');
const BaseController = require('./BaseController');

class ShopController extends BaseController {
  constructor() {
    super(ShopController);
  }

  async getBrands(req, res) {
    const { min, max, subcategoryId } = { ...JSON.parse(req.query.filters) };
    const { status, Brands, failedMessage } = await ShopServiceInstance.getSubcategoryBrands({
      min,
      max,
      subcategoryId
    });
    return super.sendResponseWithMessage(res, status, { Brands }, failedMessage);
  }

  async getPrices(req, res) {
    const { subcategoryId, brandId } = { ...JSON.parse(req.query.filters) };
    const { status, prices, counts, failedMessage } = await ShopServiceInstance.getPrices({
      subcategoryId,
      brandId
    });
    return super.sendResponseWithMessage(res, status, { prices, counts }, failedMessage);
  }

  async getFilters(req, res) {
    const { min, max, subcategoryId, brandId } = { ...JSON.parse(req.query.filters) };
    const { status, Filters, failedMessage } = await ShopServiceInstance.getFilters({
      min,
      max,
      subcategoryId,
      brandId
    });
    return super.sendResponseWithMessage(res, status, { Filters }, failedMessage);
  }

  async getProducts(req, res) {
    const { min, max, subcategoryId, brandId, filterValueIds, offSet } = {
      ...JSON.parse(req.query.filters)
    };
    const prodWhere = { min, max, subcategoryId, brandId, offSet };
    const filterWhere = { filterValueIds };
    const { status, products, failedMessage } = await ShopServiceInstance.getProducts(
      prodWhere,
      filterWhere
    );
    return super.sendResponseWithMessage(res, status, { products }, failedMessage);
  }

  async sortProducts(req, res) {}

  async loadMoreProducts(req, res) {}
}

const ShopControllerInstance = new ShopController();

module.exports = ShopControllerInstance;
