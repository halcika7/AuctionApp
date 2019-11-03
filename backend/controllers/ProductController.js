const ProductServiceInstance = require('../services/ProductService');

class ProductController {
    constructor() {
        if (!!ProductController.instance) return ProductController.instance;
        ProductController.instance = this;
        return this;
    }

    async products(req, res) {
        const { failedMessage, status, ...products } = await ProductServiceInstance.products(
            req.params.type
        );
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json(products);
    }
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
