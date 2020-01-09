const BaseController = require('./BaseController');
const OrderService = require('../services/OrderService');
const ReviewService = require('../services/ReviewService');
const { paymentViewValidation } = require('../validations/paymentValidation');
const { getProductById } = require('../helpers/productFilter');
const { productOwnerInfo } = require('../helpers/authHelper');

class PaymentController extends BaseController {
  constructor() {
    super(PaymentController);
  }

  async validateUser(req, res) {
    const { productId, subcategoryId } = req.body;
    const { userId, accessToken } = req;

    const { valid } = await paymentViewValidation(productId, subcategoryId, userId);

    if (!valid) {
      return super.sendResponse(res, 404, { accessToken, message: 'Product not found !' });
    }

    return super.sendResponse(res, 200, { accessToken });
  }

  async payOrder(req, res) {
    const { productId, subcategoryId, addressInformation, cardInformation, userRating } = req.body;
    const { userId, accessToken } = req;

    const { message, errors, ownerId, status } = await OrderService.updateOrder(
      addressInformation,
      cardInformation,
      productId,
      subcategoryId,
      userId
    );

    if (status !== 200) {
      return super.sendResponse(res, status, { accessToken, message, errors });
    }

    await ReviewService.addOrUpdateReview(userRating, userId, ownerId);

    return super.sendResponse(res, status, { message });
  }

  async getOwnerInfo(req, res) {
    const { id, subcategoryId } = req.params;
    const { userId, accessToken } = req;

    try {
      const product = await getProductById(id, subcategoryId);
      const ownerInfo = await productOwnerInfo(product.userId);
      const userRating = await ReviewService.findReview(userId, product.userId);

      return super.sendResponse(res, 200, {
        ownerInfo,
        rating: userRating ? userRating.rating : 0,
        accessToken
      });
    } catch (error) {
      return super.sendResponse(res, 403, { message: error.message });
    }
  }
}

const PaymentControllerInstance = new PaymentController();

module.exports = PaymentControllerInstance;
