const BaseController = require('./BaseController');
const BrandServiceInstance = require('../services/BrandService');

class BrandController extends BaseController {
  constructor() {
    super(BrandController);
  }

  async getShopBrands(req, res) {
    const { min, max, subcategoryId } = { ...JSON.parse(req.query.filters) };
    const { status, Brands, failedMessage } = await BrandServiceInstance.getSubcategoryBrands({
      min,
      max,
      subcategoryId
    });
    return super.sendResponseWithMessage(res, status, { Brands }, failedMessage);
  }
}

const BrandControllerInstance = new BrandController();

module.exports = BrandControllerInstance;
