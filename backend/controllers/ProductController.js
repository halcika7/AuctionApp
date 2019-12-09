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
    const { min, max, subcategoryId, brandId, filterValueIds, offSet, orderBy } = {
      ...JSON.parse(req.query.filters)
    };
    const prodWhere = { min, max, subcategoryId, brandId, offSet, orderBy };
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
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
