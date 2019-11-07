const { getFilteredProducts } = require('../helpers/productFilter');
const BaseService = require('./BaseService');

class ProductService extends BaseService {
    constructor() {
        super(ProductService);
    }

    async filterProducts(reqParams) {
        try {
            const { products, numberOfProducts } = await getFilteredProducts(reqParams);
            const eq = 2 * parseInt(reqParams.limit) + parseInt(reqParams.offset);
            const noMore =
                products.length === 0 ||
                products.length < parseInt(reqParams.limit) ||
                numberOfProducts === eq
                    ? true
                    : false;
            return { status: 200, [reqParams.type]: products, noMore };
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
