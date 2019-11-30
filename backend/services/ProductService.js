const {
  getFilteredProducts,
  getProductById,
  getSimilarProducts,
  noMoreProducts
} = require('../helpers/productFilter');
const { decodeToken } = require('../helpers/authHelper');
const { LIMIT_SHOP_PRODUCTS } = require('../config/configs');
const BaseService = require('./BaseService');
const BidService = require('./BidService');

class ProductService extends BaseService {
  constructor() {
    super(ProductService);
  }

  async filterProducts(reqParams) {
    try {
      const { products, numberOfProducts } = await getFilteredProducts(reqParams);
      const noMore = noMoreProducts({
        limit: reqParams.limit,
        offset: reqParams.offset,
        productsLength: numberOfProducts
      });
      return { status: 200, products, noMore };
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async findProductById(productId, token) {
    try {
      const product = await getProductById(productId);
      const { id } = decodeToken(token) || { id: undefined };
      const { bids } = id === product.userId && (await BidService.filterBidsForProduct(productId));
      return { status: 200, product, bids };
    } catch (error) {
      return super.returnResponse(403, {});
    }
  }

  async findSimilarProducts(subcategoryId, id) {
    try {
      const similarProducts = (await getSimilarProducts(subcategoryId, id)) || [];
      return { status: 200, similarProducts };
    } catch (error) {
      return super.returnResponse(403, { similarProducts: [] });
    }
  }

  async getShopProducts(productWhere, filterValueIds) {
    try {
      const { products, numberOfProducts, priceRange } = await getFilteredProducts({
        ...productWhere,
        offset: productWhere.offSet,
        filterValueIds,
        limit: LIMIT_SHOP_PRODUCTS,
        type: 'Shop'
      });
      const noMore = noMoreProducts({
        limit: LIMIT_SHOP_PRODUCTS,
        offset: productWhere.offSet,
        productsLength: numberOfProducts
      });
      return { status: 200, products, noMore, priceRange };
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const ProductServiceInstance = new ProductService();

module.exports = ProductServiceInstance;
