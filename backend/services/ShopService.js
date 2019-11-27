const BaseService = require('./BaseService');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Filter = require('../models/Filter');
const FilterValue = require('../models/FilterValue');
const FilterValueProduct = require('../models/FilterValueProduct');
const { db, Op } = require('../config/database');
const { removeNullProperty } = require('../helpers/removeNullProperty');
const { LIMIT_SHOP_PRODUCTS } = require('../config/configs');

class ShopService extends BaseService {
  constructor() {
    super(ShopService);
  }

  returnWhereObject({ min, max, subcategoryId, brandId }, auctionEnd) {
    const obj = {
      ...removeNullProperty({
        subcategoryId,
        brandId
      })
    };
    if (min && max) {
      obj['price'] = {
        [Op.and]: {
          [Op.gte]: min,
          [Op.lte]: max
        }
      };
    }
    if (auctionEnd) {
      obj['auctionEnd'] = {
        [Op.gt]: new Date()
      };
    }
    return obj;
  }

  async getSubcategoryBrands(reqQueryData) {
    try {
      const where = this.returnWhereObject(reqQueryData, true);
      const subId = { ...removeNullProperty({ id: reqQueryData.subcategoryId }) };
      const Brands = await Brand.findAll({
        include: [
          {
            model: Subcategory,
            attributes: [],
            where: { ...subId }
          },
          {
            model: Product,
            where,
            attributes: []
          }
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

  async getPrices(reqQueryData) {
    try {
      let counts = [];
      const where = this.returnWhereObject(reqQueryData, true);
      const prices = await Product.findOne({
        where,
        attributes: [
          [db.fn('ROUND', db.fn('AVG', db.cast(db.col('price'), 'numeric')), 2), 'avg_price'],
          [db.fn('MAX', db.col('price')), 'max_price'],
          [db.fn('MIN', db.col('price')), 'min_price']
        ]
      });

      for (let i = 0; i < 20; i++) {
        let price =
          i === 0
            ? {
                [Op.and]: {
                  [Op.gte]: 0,
                  [Op.lt]: 100
                }
              }
            : i === 19
            ? {
                [Op.and]: {
                  [Op.gte]: 100 * i
                }
              }
            : {
                [Op.and]: {
                  [Op.gte]: 100 * i,
                  [Op.lt]: 100 * (i + 1)
                }
              };
        counts.push(
          await Product.findOne({
            raw: true,
            where: {
              ...where,
              price
            },
            attributes: [[db.fn('COUNT', db.col('id')), 'count']]
          })
        );
      }
      counts = counts.map(cts => cts.count);

      return { status: 200, prices, counts };
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async getFilters(reqQueryData) {
    try {
      if (!reqQueryData.subcategoryId) {
        let Filters = [];
        return { status: 200, Filters };
      }
      const where = this.returnWhereObject(reqQueryData, true);
      const { Filters } = await Subcategory.findOne({
        where: {
          id: reqQueryData.subcategoryId
        },
        include: {
          model: Filter,
          include: {
            model: FilterValue,
            attributes: ['value', 'id'],
            include: {
              model: Product,
              where,
              attributes: ['id']
            }
          }
        },
        attributes: []
      });
      return { status: 200, Filters };
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async getProducts(productWhere, { filterValueIds }) {
    try {
      const { offSet: offset } = { ...removeNullProperty(productWhere) };
      const subQuery = filterValueIds.length > 0 ? false : true;
      const where = this.returnWhereObject(productWhere, true);
      const attributes = ['id', 'name', 'price', 'picture', 'details', 'subcategoryId'];
      let whereId = {};
      let having = {};
      if (filterValueIds.length > 0) {
        whereId['id'] = {
          [Op.in]: filterValueIds
        };
        having = {
          having: db.where(db.fn('COUNT', db.col('FilterValues.FilterValueProducts.id')), {
            [Op.eq]: filterValueIds.length
          }),
          group: ['Product.id', "FilterValues->FilterValueProducts.id"]
        };
      }

      const products = await Product.findAll({
        subQuery,
        where,
        attributes,
        include: {
          model: FilterValue,
          attributes: [],
          where: { ...whereId },
          through: {
            model: FilterValueProduct,
            attributes: []
          }
        },
        limit: LIMIT_SHOP_PRODUCTS,
        offset,
        ...having
      });
      return { status: 200, products };
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const ShopServiceInstance = new ShopService();

module.exports = ShopServiceInstance;
