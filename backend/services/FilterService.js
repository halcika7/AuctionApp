const BaseService = require('./BaseService');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const Filter = require('../models/Filter');
const FilterSubcategory = require('../models/FilterSubcategory');
const FilterValue = require('../models/FilterValue');
const FilterValueProduct = require('../models/FilterValueProduct');
const { returnWhereObject } = require('../helpers/returnWhereObject');
const { db, Op } = require('../config/database');

class FilterService extends BaseService {
  constructor() {
    super(FilterService);
  }

  async getFilters(reqQueryData) {
    try {
      if (!reqQueryData.subcategoryId) {
        let Filters = [];
        return { status: 200, Filters };
      }
      const where = returnWhereObject(reqQueryData, true);
      if (reqQueryData.name) {
        where[Op.and] = db.where(db.fn('lower', db.col('Filters.FilterValues.Products.name')), {
          [Op.like]: `%${reqQueryData.name}%`
        });
      }
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
}

const FilterServiceInstance = new FilterService();

module.exports = FilterServiceInstance;
