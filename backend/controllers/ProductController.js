const ProductServiceInstance = require('../services/ProductService');

class ProductController {
    constructor() {
        if (!!ProductController.instance) return ProductController.instance;
        ProductController.instance = this;
        return this;
    }

    async featuredProducts(req, res) {
        const { featured, failedMessage, status } = await ProductServiceInstance.featured();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ featured });
    }

    async featuredCollections(req, res) {
        const { featuredCollections, failedMessage, status } = await ProductServiceInstance.featuredCollections();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ featuredCollections });
    }

    async newArrivalProducts(req, res) {
        const { newArrivals, failedMessage, status } = await ProductServiceInstance.newArrivals();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ newArrivals });
    }

    async topRatedProducts(req, res) {
        const { topRated, failedMessage, status } = await ProductServiceInstance.topRated();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ topRated });
    }

    async lastChanceProducts(req, res) {
        const { lastChance, failedMessage, status } = await ProductServiceInstance.lastChance();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ lastChance });
    }

    async heroProduct(req, res) {
        const { heroProduct, failedMessage, status } = await ProductServiceInstance.heroProduct();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ heroProduct });
    }

    async productWithSub(req, res) {
        const { prod, failedMessage, status } = await ProductServiceInstance.withSub();
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }
        return res.status(200).json({ prod });
    }
}

const ProductControllerInstance = new ProductController();

module.exports = ProductControllerInstance;
