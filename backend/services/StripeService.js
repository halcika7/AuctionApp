const BaseService = require('./BaseService');
const CardInfo = require('../models/CardInfo');
const stripe = require('../config/stripeConfig');
const fs = require('fs');

class StripeService extends BaseService {
  constructor() {
    super(StripeService);
  }

  async validateCard(errors, userCardInfoId, cardInfo) {
    const { card, id } = await stripe.tokens.create({
      card: { ...cardInfo, currency: 'usd' }
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
    if (!description || !email) return;

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

  async createTransfer(accountId, amount, source, description) {
    amount = this.calculateStripeFees(amount);
    return await stripe.charges.create({
      amount,
      currency: 'usd',
      description,
      ...source,
      transfer_data: {
        destination: accountId
      }
    });
  }

  async createAccount(email) {
    const account = await stripe.accounts.create({
      type: 'custom',
      country: 'US',
      email,
      requested_capabilities: ['card_payments', 'transfers']
    });

    await this.updateAccount(account.id, email);

    return account;
  }

  async updateAccount(accountId, email) {
    const ff = fs.readFileSync('./backend/images/img1.jpg');
    const fb = fs.readFileSync('./backend/images/img2.jpg');
    const back = await stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: ff,
        name: 'file.jpg',
        type: 'application/octet-stream'
      }
    });
    const front = await stripe.files.create({
      purpose: 'identity_document',
      file: {
        data: fb,
        name: 'file.jpg',
        type: 'application/octet-stream'
      }
    });
    const ip =
      Math.floor(Math.random() * 255) +
      1 +
      '.' +
      (Math.floor(Math.random() * 255) + 0) +
      '.' +
      (Math.floor(Math.random() * 255) + 0) +
      '.' +
      (Math.floor(Math.random() * 255) + 0);
    return await stripe.accounts.update(accountId, {
      business_type: 'individual',
      business_profile: {
        name: 'some bussiness',
        url: 'https://ebay.com',
        product_description: 'General Contractors-Residential and Commercial',
        mcc: '5734'
      },
      individual: {
        address: {
          city: 'New York',
          country: 'US',
          line1: '707 Nostrand Ave, Brooklyn, NY 11216, United States',
          postal_code: '11216',
          state: 'New York'
        },
        dob: {
          day: 20,
          month: 2,
          year: 1980
        },
        ssn_last_4: '8888',
        id_number: '000008888',
        email,
        phone: '+1 (718) 493-1375',
        first_name: 'John',
        last_name: 'Doe',
        verification: {
          document: {
            front: front.id,
            back: back.id
          }
        }
      },
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip
      }
    });
  }

  calculateStripeFees(amount) {
    return parseInt(amount - (amount * 0.0029 + 0.3)) * 100;
  }
}

const StripeServiceInstance = new StripeService();

module.exports = StripeServiceInstance;
