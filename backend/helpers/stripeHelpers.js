const CardInfo = require('../models/CardInfo');
const stripe = require('../config/stripeConfig');

exports.validateCard = async (errors, userCardInfoId, cardInfo) => {
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
};
