const BaseController = require('./BaseController');
const BidService = require('../services/BidService');

class BidController extends BaseController {
  constructor() {
    super(BidController);
  }

  async makeBid(req, res, socket) {
    const { productId, bid } = req.body;
    const { userId, accessToken } = req;
    const { message, status, highest_bid } = await BidService.createBid(userId, productId, bid);

    if (status === 403) {
      return super.sendResponse(res, status, { message, accessToken });
    }

    socket.broadcast.emit('bid-added', { productId, highest_bid });

    return super.sendResponse(res, status, { message, accessToken });
  }

  async getUserBids(req, res) {
    const { userId, accessToken } = req;
    const { offset } = JSON.parse(req.query.data);
    const { bids, noMore, status, message } = await BidService.getUserBids(userId, offset);

    return super.sendResponseWithMessage(res, status, { bids, noMore, accessToken }, message);
  }
}

const BidControllerInstance = new BidController();

module.exports = BidControllerInstance;
