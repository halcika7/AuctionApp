const {
  getFilteredProducts,
  getProductById,
  getSimilarProducts,
  getProfileProducts,
  noMoreProducts,
  hasActiveProduct
} = require('../helpers/productFilter');
const { decodeToken } = require('../helpers/authHelper');
const { LIMIT_SHOP_PRODUCTS } = require('../config/configs');
const BaseService = require('./BaseService');
const BidService = require('./BidService');
const { addProductValidation } = require('../validations/addProductValidation');
const fs = require('fs');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const { cloudinary } = require('../config/cloudinaryConfig');
const { transformProductData } = require('../helpers/transformProductData');
const stripe = require('../config/stripeConfig');

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
      const { id } = decodeToken(token) || { id: undefined };
      const { bids } = id === product.userId && (await BidService.filterBidsForProduct(productId));
      return super.returnResponse(200, { product, bids });
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
        if (images.length > 0) images.forEach(image => fs.unlinkSync(image.path));
        return super.returnResponse(403, errors);
      }
      const uploadImages = await Promise.all(
        images.map(async image => {
          const { secure_url } = await cloudinary.uploader.upload(image.path);
          return secure_url;
        })
      );
      if (productData.featured) {
        let source =
          Object.keys(choosenCardToken).length > 0
            ? choosenCardToken
            : { source: choosenCardToken };
        const charge = await stripe.charges.create({
          amount: 1000,
          currency: 'usd',
          description: 'Featuring product',
          ...source
        });
        if (charge.amount !== 1000) {
          productData.featured = false;
        }
      }
      productData = transformProductData(
        productData,
        uploadImages[0],
        brandData,
        subcategoryData,
        userId
      );
      if (images.length > 0) images.forEach(image => fs.unlinkSync(image.path));

      const product = await Product.create({ ...productData });
      Product.bulkCreate;
      const productImages = uploadImages.slice(1).map(image => ({ image, productId: product.id }));
      await ProductImage.bulkCreate(productImages);

      const responseMessage = productData.featured
        ? 'Product successfully added and charged $10.00 for featuring product'
        : 'Product successfully added';

      return super.returnResponse(200, { success: responseMessage });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const ProductServiceInstance = new ProductService();

module.exports = ProductServiceInstance;
