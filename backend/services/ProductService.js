const { findProducts } = require('../helpers/productHelper');

class ProductService {
    constructor() {
        if (!!ProductService.instance) return ProductService.instance;
        ProductService.instance = this;
        return this;
    }

    async featured() {
        try {
            const featured = await findProducts({ where: { featured: true }, limit: 4 });
            return { status: 200, featured };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }

    async featuredCollections() {
        try {
            const featuredCollections = await findProducts({ where: { featured: true }, limit: 3 });
            return { status: 200, featuredCollections };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }

    async newArrivals() {
        try {
            const newArrivals = await findProducts({
                order: [['auctionStart', 'DESC']],
                limit: 8,
                auctionStart: true
            });
            return { status: 200, newArrivals };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }

    async lastChance() {
        try {
            const lastChance = await findProducts({
                order: [['auctionEnd', 'ASC']],
                limit: 8
            });
            return { status: 200, lastChance };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }

    async topRated() {
        try {
            const topRated = await findProducts({ rated: true, limit: 8 });
            return { status: 200, topRated };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }

    async heroProduct() {
        try {
            const heroProduct = await findProducts({ limit: 1, hero: true });
            return { status: 200, heroProduct };
        } catch (error) {
            return {
                status: 403,
                failedMessage: 'Something happened. We were unable to perform request.'
            };
        }
    }

    async withSub() {
        try {
            const prod = await findProducts({ limit: 1, sub: true });
            return { status: 200, prod };
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
