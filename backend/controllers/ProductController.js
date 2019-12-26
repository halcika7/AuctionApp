const BaseController = require('./BaseController');
const ProductServiceInstance = require('../services/ProductService');

class ProductController extends BaseController {
  constructor() {
    super(ProductController);
  }

  async getProducts(req, res) {
    const { failedMessage, status, noMore, products } = await ProductServiceInstance.filterProducts(
      req.params
    );

    if (req.params.offset && !failedMessage) {
      return super.sendResponse(res, status, {
        [req.params.type]: products,
        noMore
      });
    }

    return super.sendResponse(
      res,
      status,
      { [req.params.type]: products, noMore },
      { failedMessage }
    );
  }

  async getProduct(req, res) {
    const token = super.getAuthorizationHeader(req);
    const {
      product,
      highestBidUserId,
      status,
      message
    } = await ProductServiceInstance.findProductById(
      req.params.id,
      req.params.subcategoryId,
      token
    );

    if (!product) {
      return super.sendResponse(res, status, { error: 'Product not found !' });
    }

    return super.sendResponse(res, status, { product, highestBidUserId, message });
  }

  async getSimilarProducts(req, res) {
    const { similarProducts, status } = await ProductServiceInstance.findSimilarProducts(
      req.params.subcategoryId,
      req.params.id
    );

    return super.sendResponse(res, status, { similarProducts });
  }

  async getShopProducts(req, res) {
    const { min, max, subcategoryId, brandId, filterValueIds, offSet, orderBy, name } = {
      ...JSON.parse(req.query.filters)
    };
    const prodWhere = { min, max, subcategoryId, brandId, offSet, orderBy, name };
    const {
      status,
      products,
      noMore,
      priceRange,
      failedMessage
    } = await ProductServiceInstance.getShopProducts(prodWhere, filterValueIds);

    return super.sendResponseWithMessage(
      res,
      status,
      { products, noMore, priceRange },
      failedMessage
    );
  }

  async getUserProducts(req, res) {
    const { userId, accessToken } = req;
    const { products, noMore, status, message } = await ProductServiceInstance.fetchUserProducts(
      req.query.data,
      userId
    );

    return super.sendResponseWithMessage(res, status, { products, noMore, accessToken }, message);
  }

  async userNumberOfActiveProducts(req, res) {
    const { userId, accessToken } = req;
    const {
      hasActiveProduct,
      status,
      message
    } = await ProductServiceInstance.getActiveUserProductsCount(userId);

    return super.sendResponseWithMessage(res, status, { hasActiveProduct, accessToken }, message);
  }

  async addProduct(req, res) {
    const { userId, accessToken } = req;

    const { status, message, success, errors } = await ProductServiceInstance.addProduct(
      userId,
      req.files,
      req.body
    );

    return super.sendResponseWithMessage(
      res,
      status,
      { errors, message: success, accessToken },
      message
    );
  }
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
