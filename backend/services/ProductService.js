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

    async products(type, limit) {
        let objFind = {
            where:
                type === 'featured' || type === 'featuredCollections' ? { featured: true } : null,
            limit: limit,
            order:
                type === 'newArrivals'
                    ? [['auctionStart', 'DESC']]
                    : type === 'lastChance'
                    ? [['auctionEnd', 'ASC']]
                    : null,
            auctionStart: type === 'newArrivals' ? true : null,
            rated: type === 'topRated' ? true : null,
            hero: type === 'heroProduct' ? true : null
        };
        !objFind.where && delete objFind.where;
        !objFind.order && delete objFind.order;
        !objFind.auctionStart && delete objFind.auctionStart;
        !objFind.rated && delete objFind.rated;
        !objFind.hero && delete objFind.hero;

        const { products, failedMessage, status } = await this.helperfunction(
            objFind,
            findProducts
        );
        return { [type]: products, failedMessage, status };
    }
}

const ProductServiceInstance = new ProductService();

module.exports = ProductServiceInstance;
