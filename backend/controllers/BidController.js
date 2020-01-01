const BaseController = require('./BaseController');
const BidService = require('../services/BidService');

class BidController extends BaseController {
  constructor() {
    super(BidController);
  }

  async makeBid(req, res, io) {
    const { productId, bid } = req.body;
    const { userId, accessToken } = req;
    const { message, status, highest_bid } = await BidService.createBid(userId, productId, bid);

    if (status === 403) {
      return super.sendResponse(res, status, { message, accessToken });
    }

    io.emit('bid-added', { productId, highest_bid, userId });

    return super.sendResponse(res, status, { message, accessToken });
  }

  async getUserBids(req, res) {
    const { userId, accessToken } = req;
    const { offset } = JSON.parse(req.query.data);
    const { bids, noMore, status, message } = await BidService.getUserBids(userId, offset);

    return super.sendResponseWithMessage(res, status, { bids, noMore, accessToken }, message);
  }

  async getProductBids(req, res) {
    const token = super.getAuthorizationHeader(req);
    const { productId, subcategoryId } = req.params;
    const { bids } = await BidService.filterBidsForProduct(productId, subcategoryId, token);

    return super.sendResponse(res, 200, { bids });
  }
}

const BidControllerInstance = new BidController();

module.exports = BidControllerInstance;
