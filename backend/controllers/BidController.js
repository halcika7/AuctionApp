const BaseController = require("./BaseController");
const BidService = require("../services/BidService");

class BidController extends BaseController {
  constructor() {
    super(BidController);
  }

  async makeBid(req, res) {
    const { productId, bid } = req.body;
    const { userId } = req;
    const {
      message,
      status,
      highest_bid
    } = await BidService.createBid(userId, productId, bid);
    if (staus === 403) {
      return super.sendResponse(res, status, { message, highest_bid });
    }
    return super.sendResponse(res, status, { message, highest_bid });
  }
}

const BidControllerInstance = new BidController();

module.exports = BidControllerInstance;
