const BaseService = require('./BaseService');
const Product = require('../models/Product');
const { db, Op } = require('../config/database');
const { returnWhereObject } = require('../helpers/returnWhereObject');

class ShopService extends BaseService {
  constructor() {
    super(ShopService);
  }

  async getPrices(reqQueryData) {
    try {
      const where = returnWhereObject(reqQueryData, true);
      if (reqQueryData.name) {
        where[Op.and] = db.where(db.fn('lower', db.col('name')), {
          [Op.like]: `%${reqQueryData.name}%`
        });
      }
      const prices = await Product.findOne({
        where,
        raw: true,
        attributes: [
          [db.fn('coalesce', db.fn('ROUND', db.fn('AVG', db.cast(db.col('price'), 'numeric')), 2), 0), 'avg_price'],
          [db.fn('coalesce', db.fn('MAX', db.col('price')), 0), 'max_price'],
          [db.fn('coalesce', db.fn('MIN', db.col('price')), 0), 'min_price']
        ]
      });
      return super.returnResponse(200, { prices });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const ShopServiceInstance = new ShopService();

module.exports = ShopServiceInstance;
