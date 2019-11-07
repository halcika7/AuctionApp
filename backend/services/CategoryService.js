const Category = require('../model/Category');
const Subcategory = require('../model/Subcategory');
const BaseService = require('./BaseService');

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
                ]
            };
            const categories = await Category.findAll(findObj);
            return { status: 200, categories };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }
}

const CategoryServiceInstance = new CategoryService();

module.exports = CategoryServiceInstance;
