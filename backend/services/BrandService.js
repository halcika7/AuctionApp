const BaseService = require('./BaseService');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const { db } = require('../config/database');
const { removeNullProperty } = require('../helpers/removeNullProperty');
const { returnWhereObject } = require('../helpers/returnWhereObject');

class BrandService extends BaseService {
  constructor() {
    super(BrandService);
  }

  async getSubcategoryBrands(reqQueryData) {
    try {
      const where = returnWhereObject(reqQueryData, true);
      const subId = { ...removeNullProperty({ id: reqQueryData.subcategoryId }) };
      const Brands = await Brand.findAll({
        include: [
          { model: Subcategory, attributes: [], where: { ...subId } },
          { model: Product, where, attributes: [] }
        ],
        attributes: ['id', 'name', [db.fn('COUNT', db.col('Products.id')), 'number_of_products']],
        group: ['Brand.id', 'Subcategories->BrandSubcategories.id'],
        order: [['name', 'ASC']]
      });
      return { status: 200, Brands };
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const BrandServiceInstance = new BrandService();

module.exports = BrandServiceInstance;
