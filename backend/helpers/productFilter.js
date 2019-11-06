const Product = require('../model/Product');
const ProductReview = require('../model/ProductReview');
const { db, Op } = require('../config/database');
const { STARTS_IN_MAX_DAYS, ENDS_IN_MAX_DAYS } = require('../config/configs');
const { addDaysToDate } = require('./addDaysToDate');

function filterProducts({ type, limit, offset = 0 }) {
    limit = parseInt(limit);
    offset = parseInt(offset);
    let findObj = {
        where: {
            auctionEnd: {
                [Op.gt]: new Date()
            }
        },
        attributes: ['id', 'name', 'price', 'picture'],
        order: db.random(),
        limit,
        offset
    };

    if (type === 'featured' || type === 'featuredCollections') {
        findObj.where.featured = true;
    }

    if (type === 'newArrivals') {
        findObj.where.auctionStart = {
            [Op.gt]: new Date(),
            [Op.lte]: addDaysToDate(STARTS_IN_MAX_DAYS)
        };
        findObj.order = [['auctionStart', 'DESC']];
    }

    if (type === 'lastChance') {
        findObj.where.auctionEnd = {
            [Op.gt]: new Date(),
            [Op.lte]: addDaysToDate(ENDS_IN_MAX_DAYS)
        };
        findObj.order = [['auctionEnd', 'DESC']];
    }

    if (type === 'topRated') {
        findObj.subQuery = false;
        findObj.include = [
            {
                model: ProductReview,
                attributes: []
            }
        ];
        findObj.attributes.push([db.fn('ROUND', db.fn('AVG', db.col('rating')), 2), 'avg_rating']);
        findObj.having = db.where(
            db.fn('ROUND', db.fn('AVG', db.col('rating')), 2),
            {
                [Op.gte]: 3
            }
        );
        findObj.group = ['Product.id'];
        findObj.order = [[db.fn('ROUND', db.fn('AVG', db.col('rating')), 2), 'DESC']];
    }

    if (type === 'heroProduct') {
        findObj.attributes.push('details');
    }

    return { ...findObj };
}

exports.getFilteredProducts = async obj => {
    const filterObject = filterProducts(obj);
    return await Product.findAll(filterObject);
};
