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
    const token = req.headers.authorization.split(' ')[1] || null;
    const { product, bids, status } = await ProductServiceInstance.findProductById(
      req.params.id,
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
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
