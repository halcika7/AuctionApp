const BaseController = require('./BaseController');
const BrandServiceInstance = require('../services/BrandService');

class BrandController extends BaseController {
  constructor() {
    super(BrandController);
  }

  async getShopBrands(req, res) {
    const { min, max, subcategoryId, name } = { ...JSON.parse(req.query.filters) };
    const { status, Brands, failedMessage } = await BrandServiceInstance.getSubcategoryBrands({
      min,
      max,
      subcategoryId,
      name
    });

    return super.sendResponseWithMessage(res, status, { Brands }, failedMessage);
  }

  async getAddProductBrands(req, res) {
    const { status, Brands, failedMessage } = await BrandServiceInstance.getSubcategoryBrands(
      { subcategoryId: req.params.id },
      false
    );

    return super.sendResponseWithMessage(res, status, { Brands }, failedMessage);
  }
}

const BrandControllerInstance = new BrandController();

module.exports = BrandControllerInstance;
