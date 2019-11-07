const { getFilteredProducts, getProductById } = require('../helpers/productFilter');
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

    async getSingleProduct(id) {
        try {
            const product = await getProductById(id);
            return { status: 200, product };
        } catch (error) {
            return {
                status: 403,
                error: error
            };
        }
    }

    async findSimilarProducts(subcategoryId, id) {
        try {
            const { products } = await getFilteredProducts({
                limit: 3,
                where: { subcategoryId },
                id
            });
            return { status: 200, similarProducts: products };
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
