const BaseController = require('./BaseController');
const OrderService = require('../services/OrderService');
const ReviewService = require('../services/ReviewService');
const { paymentViewValidation } = require('../validations/paymentValidation');

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

    if(status !== 200) {
      return super.sendResponse(res, status, { accessToken, message, errors });
    }

    await ReviewService.addOrUpdateReview(userRating, userId, ownerId);

    return super.sendResponse(res, status, { message });
  }
}

const PaymentControllerInstance = new PaymentController();

module.exports = PaymentControllerInstance;
