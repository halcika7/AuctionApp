const BaseService = require('./BaseService');
const CardInfo = require('../models/CardInfo');
const stripe = require('../config/stripeConfig');

class StripeService extends BaseService {
  constructor() {
    super(StripeService);
  }

  async validateCard(errors, userCardInfoId, cardInfo) {
    const { card, id } = await stripe.tokens.create({
      card: { ...cardInfo }
    });
    const findCardIfExists = await CardInfo.findOne({
      where: { cardFingerprint: card.fingerprint },
      attributes: ['id', 'cardFingerprint', 'customerId']
    });

    if (findCardIfExists && findCardIfExists.id !== userCardInfoId) {
      let cardError = 'Card already in use';

      if (errors.errors) {
        errors.errors.card = cardError;
      } else {
        errors.card = cardError;
      }

      return { valid: false, errors };
    }

    return { valid: true, card, id };
  }

  async createCustomer(description, email) {
    if(!description || !email) return;
    
    return await stripe.customers.create({ description, email });
  }

  async deleteCustomer(customerId) {
    return await stripe.customers.del(customerId);
  }

  async createSource(customerId, id) {
    return await stripe.customers.createSource(customerId, { source: id });
  }

  async deleteSource(customerId, cardId) {
    return await stripe.customers.deleteSource(customerId, cardId);
  }

  async createCharge(amount, description, source) {
    return stripe.charges.create({
      amount,
      currency: 'usd',
      description,
      ...source
    });
  }
}

const StripeServiceInstance = new StripeService();

module.exports = StripeServiceInstance;
