const BaseController = require('./BaseController');
const ProductServiceInstance = require('../services/ProductService');

class ProductController extends BaseController {
    constructor() {
        super(ProductController);
    }

    async getProducts(req, res) {
        const {
            failedMessage,
            status,
            noMore,
            products
        } = await ProductServiceInstance.filterProducts(req.params);

        if (req.params.offset && !failedMessage) {
            return super.sendResponse(res, status, {
                [req.params.type]: products,
                noMore
            });
        }
        return super.sendResponse(
            res,
            status,
            { [req.params.type]: products, noMore },
            { failedMessage }
        );
    }

    async getProduct(req, res) {
        const { product, status } = await ProductServiceInstance.findProductById(req.params.id);
        if (!product) {
            return super.sendResponse(res, status, { error: 'Product not found !' });
        }
        const { similarProducts } =
            (await ProductServiceInstance.findSimilarProducts(product.subcategoryId, product.id)) ||
            [];
        return super.sendResponse(res, status, { product, similarProducts });
    }
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
