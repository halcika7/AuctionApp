const BaseService = require('./BaseService');
const Bid = require('../models/Bid');
const User = require('../models/User');
const Product = require('../models/Product');
const { getAuctionEndProduct, noMoreProducts } = require('../helpers/productFilter');
const { LIMIT_BIDS, MAX_BID, DEFAULT_LIMIT_PRODUCTS } = require('../config/configs');
const { db } = require('../config/database');

class BidService extends BaseService {
  constructor() {
    super(BidService);
  }

  async createBid(userID, productId, bid) {
    try {
      const { auctionEnd, price, userId } = (await getAuctionEndProduct(productId)) || {
        auctionEnd: null,
        price: null,
        userId: null
      };
      const highestBid = await Bid.findOne({
        raw: true,
        where: {
          productId
        },
        attributes: ['price', 'userId'],
        order: [['price', 'DESC']]
      });

      if (!auctionEnd) {
        return super.returnResponse(403, {
          message: 'Auction ended.Your bid was unsuccessfull!!'
        });
      }

      if (highestBid && highestBid.userId === userID) {
        return super.returnResponse(403, {
          message: 'You are already highest bidder'
        });
      }

      if (userID === userId) {
        return super.returnResponse(403, {
          message: 'You are not allowed to place bid on your own product'
        });
      }

      if (bid > MAX_BID) {
        return super.returnResponse(403, {
          message: `Maximum bid allowed is $${MAX_BID}!`
        });
      }

      if (!highestBid && price > bid) {
        return super.returnResponse(403, {
          message: 'Please bid higher or equal to product price!'
        });
      }

      if (highestBid && highestBid.price >= bid) {
        return super.returnResponse(403, {
          message: 'There are higher bids!'
        });
      }

      await Bid.create({ price: bid, userId: userID, productId });

      return super.returnResponse(200, {
        message: 'Congrats! You are the highest bidder',
        highest_bid: bid
      });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async filterBidsForProduct(productId) {
    try {
      const bids = await Bid.findAll({
        where: {
          productId
        },
        attributes: ['price', 'dateBid'],
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName', 'photo']
          }
        ],
        order: [['price', 'DESC']],
        limit: LIMIT_BIDS
      });

      return { bids };
    } catch (error) {
      return { bids: [] };
    }
  }

  async getUserBids(userId, offset, limit = DEFAULT_LIMIT_PRODUCTS) {
    try {
      const bids = await Bid.findAll({
        subQuery: false,
        where: { userId },
        attributes: ['dateBid', 'price'],
        include: {
          model: Product,
          attributes: [
            'id',
            'picture',
            'name',
            'subcategoryId',
            'price',
            'auctionEnd',
            [db.fn('coalesce', db.fn('MAX', db.col('Product.Bids.price')), 0), 'highest_bid'],
            [db.fn('coalesce', db.fn('COUNT', db.col('Product.Bids.price')), 0), 'number_of_bids'],
            [
              db.literal(`CASE WHEN "Product"."auctionEnd" > NOW() THEN 'open' ELSE 'closed' END`),
              'status'
            ]
          ],
          include: {
            model: Bid,
            attributes: []
          }
        },
        limit,
        offset,
        order: [['dateBid', 'DESC']],
        group: ['Bid.id', 'Product.id']
      });
      const length = await Bid.count({
        where: { userId }
      });
      const noMore = noMoreProducts({
        limit,
        offset,
        productsLength: length
      });

      return super.returnResponse(200, { bids, noMore });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const BidServiceInstance = new BidService();

module.exports = BidServiceInstance;
