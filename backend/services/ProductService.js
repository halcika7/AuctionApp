const {
    getFilteredProducts,
    getProductById,
    getSimilarProducts
} = require('../helpers/productFilter');
const BaseService = require('./BaseService');

class ProductService extends BaseService {
    constructor() {
        super(ProductService);
    }

    async filterProducts(reqParams) {
        try {
            const { products, numberOfProducts } = await getFilteredProducts(reqParams);
            const eq = isNaN(parseInt(reqParams.limit) + parseInt(reqParams.offset))
                ? parseInt(reqParams.limit)
                : parseInt(reqParams.limit) + parseInt(reqParams.offset);
            const noMore =
                products.length === 0 ||
                products.length < parseInt(reqParams.limit) ||
                numberOfProducts === eq
                    ? true
                    : false;
            return { status: 200, products, noMore };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }

    async findProductById(id) {
        try {
            const product = await getProductById(id);
            return { status: 200, product };
        } catch (error) {
            return {
                status: 403
            };
        }
    }

    async findSimilarProducts(subcategoryId, id) {
        try {
            const similarProducts = await getSimilarProducts(subcategoryId, id);
            return { status: 200, similarProducts };
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
