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
            ...products
        } = await ProductServiceInstance.filterProducts(req.params);

        if (req.params.offset && !failedMessage) {
            return super.sendResponse(res, status, {
                ...products,
                noMore
            });
        }
        return super.sendResponseWithMessage(res, status, products, failedMessage);
    }

    async getProduct(req, res) {
        const { product } = await ProductServiceInstance.findProductById(req.params.id);
        if (!product) {
            return res.status(403).json({ error: 'Product not found !' });
        }
        const { similarProducts } = await ProductServiceInstance.findSimilarProducts(
            product.subcategoryId,
            product.id
        );
        return res.status(200).json({ product, similarProducts });
    }
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
