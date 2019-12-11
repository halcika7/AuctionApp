const ShopServiceInstance = require('../services/ShopService');
const BaseController = require('./BaseController');

class ShopController extends BaseController {
  constructor() {
    super(ShopController);
  }

  async getPrices(req, res) {
    const { subcategoryId, brandId } = { ...JSON.parse(req.query.filters) };
    const { status, prices, failedMessage } = await ShopServiceInstance.getPrices({
      subcategoryId,
      brandId
    });
    return super.sendResponseWithMessage(res, status, { prices }, failedMessage);
  }
}

const ShopControllerInstance = new ShopController();

module.exports = ShopControllerInstance;
