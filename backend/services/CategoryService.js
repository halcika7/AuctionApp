const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const BaseService = require('./BaseService');
const { db, Op } = require('../config/database');

class CategoryService extends BaseService {
  constructor() {
    super(CategoryService);
  }

  async getCategoriesWithSubcategories() {
    try {
      const findObj = {
        attributes: ['id', 'name'],
        include: [
          {
            model: Subcategory,
            attributes: ['id', 'name']
          }
        ],
        order: [['id', 'ASC']]
      };
      const categories = await Category.findAll(findObj);
      return super.returnResponse(200, { categories });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async getShopCategories() {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        include: {
          model: Subcategory,
          attributes: [
            'id',
            'name',
            [db.fn('COUNT', db.col('Subcategories.Products.id')), 'number_of_products']
          ],
          include: {
            model: Product,
            where: {
              auctionEnd: {
                [Op.gt]: new Date()
              }
            },
            attributes: []
          }
        },
        group: ['Category.id', 'Subcategories.id'],
        order: [['id', 'ASC']]
      });
      return super.returnResponse(200, { categories });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async getCategories() {
    try {
      const categories = await Category.findAll({
        attributes: ['id', 'name'],
        order: [['id', 'ASC']]
      });
      return super.returnResponse(200, { categories });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }

  async getCategorySubcategories(CategoriesId) {
    try {
      const subcategories = await Subcategory.findAll({
        where: { CategoriesId },
        attributes: ['id', 'name'],
        order: [['id', 'ASC']]
      });
      return super.returnResponse(200, { subcategories });
    } catch (error) {
      return super.returnGenericFailed();
    }
  }
}

const CategoryServiceInstance = new CategoryService();

module.exports = CategoryServiceInstance;
