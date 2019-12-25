const WishlistServiceInstance = require('../services/WishlistService');
const BaseController = require('./BaseController');

class WishlistController extends BaseController {
  constructor() {
    super(WishlistController);
  }

  async getUserWishlistIds(req, res) {
    const { userId, accessToken } = req;

    const { ids, status } = await WishlistServiceInstance.getUserWishlistProductIds(userId);

    return super.sendResponseWithMessage(res, status, { ids, accessToken }, null);
  }

  async getUserProfileWishlist(req, res) {
    const { userId, accessToken } = req;
    const { offset } = JSON.parse(req.query.data);

    const { products, noMore, status } = await WishlistServiceInstance.getUserProfileWishlist(
      userId,
      offset
    );

    return super.sendResponse(res, status, { products, noMore, accessToken });
  }

  async addToWishlist(req, res) {
    const { userId, accessToken } = req;
    const productId = req.body.productId;
    const { status, ids } = await WishlistServiceInstance.addProductToWishlist(userId, productId);

    return super.sendResponse(res, status, { accessToken, ids });
  }

  async removeFromWishlist(req, res) {
    const { userId, accessToken } = req;
    const productId = req.query.productId;
    const { status, ids } = await WishlistServiceInstance.removeProductFromWishlist(
      userId,
      productId
    );

    return super.sendResponse(res, status, { accessToken, ids: ids ? ids : [] });
  }
}

const WishlistControllerInstance = new WishlistController();

module.exports = WishlistControllerInstance;
