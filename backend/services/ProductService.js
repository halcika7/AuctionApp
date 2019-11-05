const { getFilteredProducts } = require('../helpers/productFilter');
const BaseService = require('./BaseService');

class ProductService extends BaseService {
    constructor() {
        super(ProductService);
    }

    async filterProducts(reqParams) {
        try {
            const products = await getFilteredProducts(reqParams);
            return { status: 200, [reqParams.type]: products };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }
}

const ProductServiceInstance = new ProductService();

module.exports = ProductServiceInstance;
