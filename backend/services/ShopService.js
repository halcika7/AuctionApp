const BaseService = require('./BaseService');
const Product = require('../models/Product');
const { db } = require('../config/database');
const { returnWhereObject } = require('../helpers/returnWhereObject');

class ShopService extends BaseService {
  constructor() {
    super(ShopService);
  }

  async getPrices(reqQueryData) {
    try {
      const where = returnWhereObject(reqQueryData, true);
      const prices = await Product.findOne({
        where,
        attributes: [
          [db.fn('ROUND', db.fn('AVG', db.cast(db.col('price'), 'numeric')), 2), 'avg_price'],
          [db.fn('MAX', db.col('price')), 'max_price'],
          [db.fn('MIN', db.col('price')), 'min_price']
        ]
      });

      return { status: 200, prices };
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const ShopServiceInstance = new ShopService();

module.exports = ShopServiceInstance;
