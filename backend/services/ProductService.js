const {
  getFilteredProducts,
  getProductById,
  getSimilarProducts,
  getProfileProducts,
  noMoreProducts,
  userActiveProductsCount
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

  async findProductById(productId, subcategoryId, token) {
    try {
      const product = await getProductById(productId, subcategoryId);
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

  async fetchUserProducts(reqQuery, userId) {
    reqQuery = JSON.parse(reqQuery);
    try {
      const { products, noMore } = await getProfileProducts(reqQuery, userId);
      return super.returnResponse(200, { products, noMore });
    } catch (error) {
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }

  async getActiveUserProductsCount(userId) {
    try {
      const { count } = await userActiveProductsCount(userId);
      return super.returnResponse(200, { numberOfActiveProducts: count });
    } catch (error) {
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }

  async addProduct(userId, images, reqBody) {
    try {
      const productData = JSON.parse(reqBody.productData),
        addressInformation = JSON.parse(reqBody.addressInformation),
        cardInformation = JSON.parse(reqBody.cardInformation),
        categoryData = JSON.parse(reqBody.categoryData),
        subcategoryData = JSON.parse(reqBody.subcategoryData),
        brandData = JSON.parse(reqBody.brandData),
        filtersData = JSON.parse(reqBody.filtersData);
      const { errors, isValid } = await addProductValidation({
        productData,
        addressInformation,
        cardInformation,
        categoryData,
        subcategoryData,
        brandData,
        filtersData
      }, userId, images);

      return { status: 200, message: 'Product added' };
    } catch (error) {
      return { status: 200, message: 'Something happend. We were unable to proccess request.' };
    }
  }
}

const ProductServiceInstance = new ProductService();

module.exports = ProductServiceInstance;
