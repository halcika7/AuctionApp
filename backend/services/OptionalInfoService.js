const BaseService = require('./BaseService');
const OptionalInfo = require('../models/OptionalInfo');
const { removeNullProperty } = require('../helpers/removeNullProperty');

class OptionalInfoService extends BaseService {
  constructor() {
    super(OptionalInfoService);
  }

  async update(optionalInfo, id) {
    return OptionalInfo.update(removeNullProperty(optionalInfo), {
      where: { id }
    });
  }

  async create() {
    return await OptionalInfo.create({});
  }

  async getOptionalInfo(userId) {
    return await OptionalInfo.findOne({ where: { id: userId } });
  }
}

const OptionalInfoServiceInstance = new OptionalInfoService();

module.exports = OptionalInfoServiceInstance;
