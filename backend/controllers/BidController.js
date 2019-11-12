const BaseController = require('./BaseController');
const BidService = require('../services/BidService');

class BidController extends BaseController {
    constructor() {
        super(BidController);
    }

    async makeBid(req, res) {
        const { productId, bid } = req.body;
        const { userId } = req;
        const { failedMessage, successMessage, status, highest_bid } = await BidService.createBid(
            userId,
            productId,
            bid
        );
        if (failedMessage) {
            return super.sendResponse(res, status, { failedMessage, highest_bid });
        }
        return super.sendResponse(res, status, { successMessage, highest_bid });
    }
}

const BidControllerInstance = new BidController();

module.exports = BidControllerInstance;
