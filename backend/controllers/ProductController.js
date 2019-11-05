const BaseController = require('./BaseController');
const ProductServiceInstance = require('../services/ProductService');

class ProductController extends BaseController {
    constructor() {
        super(ProductController);
    }

    async getProducts(req, res) {
        const { failedMessage, status, ...products } = await ProductServiceInstance.filterProducts(
            req.params
        );
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        if (req.params.offset) {
            return res.status(200).json({
                ...products,
                noMore:
                    products[req.params.type].length === 0 ||
                    products[req.params.type].length < req.params.limit
                        ? true
                        : false
            });
        }
        return res.status(200).json(products);
    }
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
