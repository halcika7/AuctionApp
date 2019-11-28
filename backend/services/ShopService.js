const BaseService = require('./BaseService');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Filter = require('../models/Filter');
const FilterSubcategory = require('../models/FilterSubcategory');
const FilterValue = require('../models/FilterValue');
const FilterValueProduct = require('../models/FilterValueProduct');
const { db, Op } = require('../config/database');
const { removeNullProperty } = require('../helpers/removeNullProperty');
const { LIMIT_SHOP_PRODUCTS } = require('../config/configs');
const { noMoreProducts, getFilteredProducts } = require('../helpers/productFilter');

class ShopService extends BaseService {
  constructor() {
    super(ShopService);
  }

  returnWhereObject({ min, max, subcategoryId, brandId }, auctionEnd) {
    const obj = {
      ...removeNullProperty({ subcategoryId, brandId })
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

  async getPrices(reqQueryData) {
    try {
      const where = this.returnWhereObject(reqQueryData, true);
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
        attributes: [],
        include: {
          model: Filter,
          attributes: ['id', 'name'],
          through: {
            model: FilterSubcategory,
            attributes: []
          },
          include: {
            model: FilterValue,
            attributes: ['value', 'id'],
            include: {
              model: Product,
              where,
              attributes: ['id'],
              through: {
                model: FilterValueProduct,
                attributes: []
              }
            }
          }
        }
      });
      return { status: 200, Filters };
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async getProducts(productWhere, filterValueIds) {
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
}

const ShopServiceInstance = new ShopService();

module.exports = ShopServiceInstance;
