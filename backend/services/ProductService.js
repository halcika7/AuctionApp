const BaseService = require('./BaseService');
const BidService = require('./BidService');
const StripeService = require('./StripeService');
const CloudinaryService = require('./CloudinaryService');
const ProfileService = require('./ProfileService');
const OrderService = require('./OrderService');

const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const FilterValueProduct = require('../models/FilterValueProduct');

const {
  getFilteredProducts,
  getProductById,
  getSimilarProducts,
  getProfileProducts,
  noMoreProducts,
  hasActiveProduct
} = require('../helpers/productFilter');
const { LIMIT_SHOP_PRODUCTS, FEATURING_PRODUCT_COST } = require('../config/configs');
const { addProductValidation } = require('../validations/addProductValidation');
const { transformProductData } = require('../helpers/transformProductData');
const { unlinkFiles } = require('../helpers/unlinkFiles');

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

      return super.returnResponse(200, { products, noMore });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async findProductById(productId, subcategoryId, token) {
    try {
      const product = await getProductById(productId, subcategoryId);
      const ownerInfo = await ProfileService.getProductOwnerInfo(product.userId);
      const { id } = super.decodeAuthorizationToken(token);
      const highestBid = await BidService.getHighestBid(productId);
      const message =
        highestBid && highestBid.userId === id && product.dataValues.status == 'open'
          ? 'You are already highest bidder'
          : '';
      const wonAuction =
        (highestBid && highestBid.userId === id && product.dataValues.status == 'closed') || false;

      return super.returnResponse(200, {
        product,
        message,
        highestBidUserId: highestBid ? highestBid.userId : '',
        wonAuction,
        ownerInfo
      });
    } catch (error) {
      return super.returnResponse(403, {});
    }
  }

  async findSimilarProducts(subcategoryId, id) {
    try {
      const similarProducts = (await getSimilarProducts(subcategoryId, id)) || [];

      return super.returnResponse(200, { similarProducts });
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

      return super.returnResponse(200, { products, noMore, priceRange });
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
      return super.returnGenericFailed();
    }
  }

  async getActiveUserProductsCount(userId) {
    try {
      const active = await hasActiveProduct(userId);

      return super.returnResponse(200, { hasActiveProduct: active });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async addProduct(userId, images, reqBody) {
    try {
      let productData = JSON.parse(reqBody.productData),
        addressInformation = JSON.parse(reqBody.addressInformation),
        cardInformation = JSON.parse(reqBody.cardInformation),
        categoryData = JSON.parse(reqBody.categoryData),
        subcategoryData = JSON.parse(reqBody.subcategoryData),
        brandData = JSON.parse(reqBody.brandData),
        filtersData = JSON.parse(reqBody.filtersData);

      const { errors, isValid, choosenCardToken } = await addProductValidation(
        {
          productData,
          addressInformation,
          cardInformation,
          categoryData,
          subcategoryData,
          brandData,
          filtersData
        },
        userId,
        images
      );

      if (!isValid) {
        if (images.length > 0) unlinkFiles(images);
        return super.returnResponse(403, errors);
      }

      if (productData.featured) {
        let source =
          typeof choosenCardToken == 'string' ? { source: choosenCardToken } : choosenCardToken;

        const charge = await StripeService.createCharge(
          FEATURING_PRODUCT_COST,
          'Featuring product',
          source
        );

        if (charge.amount !== FEATURING_PRODUCT_COST) {
          productData.featured = false;
        }
      }

      const uploadImages = await CloudinaryService.uploadProductImages(images);

      if (images.length > 0) unlinkFiles(images);

      productData = transformProductData(
        productData,
        uploadImages[0],
        brandData,
        subcategoryData,
        userId
      );

      const order = await OrderService.addOrder({
        freeShipping: productData.freeShipping,
        ownerId: userId,
        shippingFrom: addressInformation
      });

      const product = await Product.create({ ...productData, orderId: order.id });

      const productImages = uploadImages.slice(1).map(image => ({ image, productId: product.id }));

      const productFilters = filtersData.map(filter => ({
        filterValueId: filter.id,
        productId: product.id
      }));

      await ProductImage.bulkCreate(productImages);
      await FilterValueProduct.bulkCreate(productFilters);

      const responseMessage = productData.featured
        ? 'Product successfully added and charged $10.00 for featuring product'
        : 'Product successfully added';

      return super.returnResponse(200, { success: responseMessage });
    } catch (error) {
      unlinkFiles(images);
      return super.returnResponse(403, {
        message: 'Something happened. We were unable to perform request.'
      });
    }
  }
}

const ProductServiceInstance = new ProductService();

module.exports = ProductServiceInstance;
