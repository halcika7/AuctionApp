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
    const { status, prices, failedMessage } = await ShopServiceInstance.getPrices({
      subcategoryId,
      brandId
    });
    return super.sendResponseWithMessage(res, status, { prices }, failedMessage);
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
    const { status, products, noMore, priceRange, failedMessage } = await ShopServiceInstance.getProducts(
      prodWhere,
      filterValueIds
    );
    return super.sendResponseWithMessage(res, status, { products, noMore, priceRange }, failedMessage);
  }
}

const ShopControllerInstance = new ShopController();

module.exports = ShopControllerInstance;
