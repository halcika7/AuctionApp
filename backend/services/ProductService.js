const {
    getFilteredProducts,
    getProductById,
    getSimilarProducts
} = require('../helpers/productFilter');
const { decodeToken } = require('../helpers/authHelper');
const BaseService = require('./BaseService');
const BidService = require('./BidService');

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

    async findProductById(productId, token) {
        try {
            const product = await getProductById(productId);
            const { id } = decodeToken(token) || { id: undefined };
            const { bids } =
                id === product.userId && (await BidService.filterBidsForProduct(productId));
            return { status: 200, product, bids };
        } catch (error) {
            return {
                status: 403
            };
        }
    }

    async findSimilarProducts(subcategoryId, id) {
        try {
            const similarProducts = (await getSimilarProducts(subcategoryId, id)) || [];
            return { status: 200, similarProducts };
        } catch (error) {
            return {
                status: 200,
                similarProducts: []
            };
        }
    }
}

const ProductServiceInstance = new ProductService();

module.exports = ProductServiceInstance;
