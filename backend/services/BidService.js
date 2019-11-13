const BaseService = require("./BaseService");
const Bid = require("../models/Bid");
const User = require("../models/User");
const { getAuctionEndProduct } = require("../helpers/productFilter");
const { LIMIT_BIDS } = require("../config/configs");

class BidService extends BaseService {
  constructor() {
    super(BidService);
  }

  async createBid(userID, productId, bid) {
    try {
      const { auctionEnd, price, userId } = (await getAuctionEndProduct(
        productId
      )) || {
        auctionEnd: null,
        price: null,
        userId: null
      };
      const highestBid = await Bid.findOne({
        raw: true,
        where: {
          productId
        },
        attributes: ["price"],
        order: [["price", "DESC"]]
      });
      if (!auctionEnd) {
        return {
          status: 403,
          message: "Auction ended.Your bid was unsuccessfull!!"
        };
      }
      if (userID === userId) {
        return {
          status: 403,
          message: "You are not allowed to place bit on your own product"
        };
      }
      if (!highestBid && price > bid) {
        return {
          status: 403,
          message: "Please bid higher than product price!"
        };
      }
      if (highestBid && highestBid.price >= bid) {
        return {
          status: 403,
          message: "There are higher bids!"
        };
      }

      await Bid.create({ price: bid, userId, productId });

      return {
        status: 200,
        message: "Congrats! You are the highest bider",
        highest_bid: bid
      };
    } catch (error) {
      return {
        status: 403,
        message: "Something happend..try again later !!"
      };
    }
  }

  async filterBidsForProduct(productId) {
    try {
      const bids = await Bid.findAll({
        where: {
          productId
        },
        attributes: ["price", "dateBid"],
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName", "photo"]
          }
        ],
        order: [["price", "DESC"]],
        limit: LIMIT_BIDS
      });

      return { bids };
    } catch (error) {
      return { bids: [] };
    }
  }
}

const BidServiceInstance = new BidService();

module.exports = BidServiceInstance;