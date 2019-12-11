const BaseController = require('./BaseController');
const FilterServiceInstance = require('../services/FilterService');

class FilterController extends BaseController {
  constructor() {
    super(FilterController);
  }

  async getFilters(req, res) {
    const { min, max, subcategoryId, brandId } = { ...JSON.parse(req.query.filters) };
    const { status, Filters, failedMessage } = await FilterServiceInstance.getFilters({
      min,
      max,
      subcategoryId,
      brandId
    });
    return super.sendResponseWithMessage(res, status, { Filters }, failedMessage);
  }
}

const FilterControllerInstance = new FilterController();

module.exports = FilterControllerInstance;
