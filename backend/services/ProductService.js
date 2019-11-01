const { findProducts } = require('../helpers/productHelper');

class ProductService {
    constructor() {
        if (!!ProductService.instance) return ProductService.instance;
        ProductService.instance = this;
        return this;
    }

    async helperfunction(obj, callBack) {
        try {
            const products = await callBack(obj);
            return { status: 200, products };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }

    async featured(limit = null) {
        const { products, failedMessage, status } = await this.helperfunction(
            {
                where: { featured: true },
                limit: limit ? limit : 4
            },
            findProducts
        );
        return { featured: products, failedMessage, status };
    }

    async newArrivals() {
        const { products, failedMessage, status } = await this.helperfunction(
            {
                order: [['auctionStart', 'DESC']],
                limit: 8,
                auctionStart: true
            },
            findProducts
        );
        return { newArrivals: products, failedMessage, status };
    }

    async lastChance() {
        const { products, failedMessage, status } = await this.helperfunction(
            {
                order: [['auctionEnd', 'ASC']],
                limit: 8
            },
            findProducts
        );
        return { lastChance: products, failedMessage, status };
    }

    async topRated() {
        const { products, failedMessage, status } = await this.helperfunction(
            { rated: true, limit: 8 },
            findProducts
        );
        return { topRated: products, failedMessage, status };
    }

    async heroProduct() {
        const { products, failedMessage, status } = await this.helperfunction(
            { limit: 1, hero: true },
            findProducts
        );
        return { heroProduct: products, failedMessage, status };
    }
}

const ProductServiceInstance = new ProductService();

module.exports = ProductServiceInstance;
