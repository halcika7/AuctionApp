const BaseService = require('./BaseService');
const CardInfo = require('../models/CardInfo');

class CardInfoService extends BaseService {
  constructor() {
    super(CardInfoService);
  }

  async findUserCardInfo(id) {
    return await CardInfo.findOne({
      raw: true,
      where: { id },
      attributes: ['customerId', 'cardId', 'accountId', 'cardFingerprint']
    });
  }

  async getUserCardInfo(id) {
    return await CardInfo.findOne({ raw: true, where: { id } });
  }

  async createCardInfo(customerId, accountId) {
    return await CardInfo.create({ customerId, accountId });
  }

  async updateCardInfo(cardInfoData, id) {
    return await CardInfo.update(cardInfoData, {
      where: { id }
    });
  }
}

const CardInfoServiceInstance = new CardInfoService();

module.exports = CardInfoServiceInstance;
