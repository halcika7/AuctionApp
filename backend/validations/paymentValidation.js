const BidService = require('../services/BidService');
const { getProductById } = require('../helpers/productFilter');
const { addressValidation, creditCardValidation } = require('./addProductValidation');
const isEmpty = require('./is-empty');

exports.paymentViewValidation = async (id, subcategoryId, userId) => {
  const product = await getProductById(id, subcategoryId);
  const highestBid = await BidService.getHighestBid(id);

  if (!highestBid || highestBid.userId !== userId || !product || product.dataValues.paid) {
    return { valid: false };
  }

  return { valid: true };
};

exports.validateUserPayment = async (
  addressInformation,
  cardInformation,
  productId,
  subcategoryId,
  bidderId
) => {
  let errors = {};
  let message = '';
  const { valid } = await this.paymentViewValidation(productId, subcategoryId, bidderId);

  if (!valid) {
    return { message: 'Product not found!' };
  }

  await addressValidation(addressInformation, errors);

  const choosenCardToken = await creditCardValidation(cardInformation, bidderId, errors);

  return {
    errors: { errors },
    isValid: isEmpty(errors),
    choosenCardToken,
    message,
    amount: highestBid.price
  };
};
