const BaseController = require('./BaseController');
const ProductServiceInstance = require('../services/ProductService');
const fs = require('fs');

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
    const token = req.headers.authorization.split(' ')[1] || null;
    const { product, bids, status } = await ProductServiceInstance.findProductById(
      req.params.id,
      req.params.subcategoryId,
      token
    );
    if (!product) {
      return super.sendResponse(res, status, { error: 'Product not found !' });
    }
    const { similarProducts } =
      (await ProductServiceInstance.findSimilarProducts(product.subcategoryId, product.id)) || [];
    return super.sendResponse(res, status, { product, similarProducts, bids });
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
      numberOfActiveProducts,
      status,
      message
    } = await ProductServiceInstance.getActiveUserProductsCount(userId);
    return super.sendResponseWithMessage(
      res,
      status,
      { numberOfActiveProducts, accessToken },
      message
    );
  }

  async addProduct(req, res) {
    const { userId } = req;

    if (req.files.length > 0) req.files.forEach(file => fs.unlinkSync(file.path));

    const { status, message, errors } = await ProductServiceInstance.addProduct(
      userId,
      req.files,
      req.body
    );

    return res.json({ success: true });
  }
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
