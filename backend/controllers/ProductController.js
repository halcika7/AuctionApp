const ProductServiceInstance = require('../services/ProductService');

class ProductController {
    constructor() {
        if (!!ProductController.instance) return ProductController.instance;
        ProductController.instance = this;
        return this;
    }

    async products(req, res) {
        const { failedMessage, status, ...products } = await ProductServiceInstance.products(
            req.params.type,
            req.params.limit,
            req.params.offset
        );
        const prod = { ...products };
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        if (req.params.offset) {
            return res.status(200).json({
                ...products,
                noMore:
                    products[req.params.type].length === 0 || products[req.params.type].length < 8
                        ? true
                        : false
            });
        }
        return res.status(200).json(products);
    }
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
