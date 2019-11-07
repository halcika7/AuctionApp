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
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
