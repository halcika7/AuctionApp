const BaseService = require('./BaseService');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const { db } = require('../config/database');
const { DEFAULT_LIMIT_PRODUCTS } = require('../config/configs');
const { noMoreProducts } = require('../helpers/productFilter');

class WishlistService extends BaseService {
  constructor() {
    super(WishlistService);
  }

  async getUserWishlistProductIds(userId) {
    try {
      const { ids } = await this.findAllWishlistProductIds(userId);

      return super.returnResponse(200, { ids });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async getUserProfileWishlist(userId, offset, limit = DEFAULT_LIMIT_PRODUCTS) {
    try {
      const products = await Wishlist.findAll({
        raw: true,
        subQuery: false,
        where: { userId },
        include: {
          model: Product,
          attributes: [],
          include: {
            model: Bid,
            attributes: []
          }
        },
        attributes: [
          [db.fn('coalesce', db.col('Product.id')), 'id'],
          [db.fn('coalesce', db.col('Product.name')), 'name'],
          [db.fn('coalesce', db.col('Product.picture')), 'picture'],
          [db.fn('coalesce', db.col('Product.price')), 'price'],
          [db.fn('coalesce', db.col('Product.auctionEnd')), 'auctionEnd'],
          [db.fn('coalesce', db.col('Product.subcategoryId')), 'subcategoryId'],
          [db.fn('coalesce', db.fn('MAX', db.col('Product.Bids.price')), 0), 'highest_bid'],
          [db.fn('coalesce', db.fn('COUNT', db.col('Product.Bids.price')), 0), 'number_of_bids'],
          [
            db.literal(`CASE WHEN "Product"."auctionEnd" > NOW() THEN 'open' ELSE 'closed' END`),
            'status'
          ]
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        group: ['Product.id', 'Wishlist.createdAt']
      });
      const length = await Wishlist.count({
        where: { userId }
      });
      const noMore = noMoreProducts({
        limit,
        offset,
        productsLength: length
      });

      return super.returnResponse(200, { products, noMore });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async addProductToWishlist(userId, productId) {
    try {
      if (!userId || !productId) return super.returnResponse(403, {});

      const productUser = await Product.findOne({
        where: { id: productId, userId }
      });

      const wishlistUserProduct = await Wishlist.findOne({
        raw: true,
        where: { userId, productId }
      });

      if (productUser || wishlistUserProduct) return super.returnResponse(403, {});

      await Wishlist.create({ userId, productId });

      const { ids } = await this.findAllWishlistProductIds(userId);

      return super.returnResponse(200, { ids });
    } catch (error) {
      return super.returnResponse(403, {});
    }
  }

  async removeProductFromWishlist(userId, productId) {
    try {
      if (!userId || !productId) return super.returnResponse(403, {});

      const wishlistUserProduct = await Wishlist.findOne({
        raw: true,
        where: { userId, productId }
      });

      if (!wishlistUserProduct) return super.returnResponse(403, {});

      await Wishlist.destroy({
        where: { userId, productId }
      });

      const { ids } = await this.findAllWishlistProductIds(userId);

      return super.returnResponse(200, { ids });
    } catch (error) {
      return super.returnResponse(403, {});
    }
  }

  async findAllWishlistProductIds(userId) {
    return await Wishlist.findOne({
      raw: true,
      where: { userId },
      attributes: [[db.fn('array_agg', db.col('productId')), 'ids']]
    });
  }
}

const WishlistServiceInstance = new WishlistService();

module.exports = WishlistServiceInstance;
