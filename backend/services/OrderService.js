const BaseService = require('./BaseService');
const Order = require('../models/Order');

const StripeService = require('./StripeService');
const CardInfoService = require('./CardInfoService');

const { validateUserPayment } = require('../validations/paymentValidation');
const { getProductOrderId } = require('../helpers/productFilter');

class OrderService extends BaseService {
  constructor() {
    super(OrderService);
  }

  async addOrder({ freeShipping, ownerId, transferTo, shippingFrom }) {
    return await Order.create({
      paid: false,
      userId: null,
      freeShipping,
      ownerId,
      transferTo,
      shippingFrom
    });
  }

  async updateOrder(addressInformation, cardInformation, productId, subcategoryId, bidderId) {
    try {
      const { isValid, errors, choosenCardToken, message, amount } = await validateUserPayment(
        addressInformation,
        cardInformation,
        productId,
        subcategoryId,
        bidderId
      );
      if (message) {
        return super.returnResponse(404, { message });
      } else if (!isValid) {
        return super.returnResponse(403, errors);
      }

      const { orderId, userId } = await getProductOrderId(productId);

      const { accountId } = await CardInfoService.findUserCardInfo(userId);

      const source =
        typeof choosenCardToken == 'string' ? { source: choosenCardToken } : choosenCardToken;

      await StripeService.createTransfer(accountId, amount, source, `Order paid, with ID = ${productId} and by user id = ${bidderId}`);

      const [updatedOrder] = await Order.update(
        {
          shippingTo: addressInformation,
          paid: true,
          userId: bidderId
        },
        {
          where: { id: orderId }
        }
      );

      if (updatedOrder == 0) {
        return super.returnResponse(403, {
          message: 'Something happened. We were unable to perform request.'
        });
      }

      return super.returnResponse(200, {
        message: "You have successfully paid order. The order will be shipped soon.",
        ownerId: userId
      });
    } catch (error) {
      console.log('TCL: updateOrder -> error', error)
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }
}

const OrderServiceInstance = new OrderService();

module.exports = OrderServiceInstance;
