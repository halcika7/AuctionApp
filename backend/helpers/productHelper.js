const Product = require('../model/Product');
const ProductReview = require('../model/ProductReview');
const { db, Op } = require('../config/database');

exports.findProducts = async ({ where, order, limit, auctionStart, rated, hero }) => {
    const findObj = {
        where: {
            auctionEnd: {
                [Op.gt]: new Date()
            },
            ...where
        },
        attributes: ['id', 'name', 'price', 'picture', 'auctionStart', 'auctionEnd'],
        order: order ? order : db.random(),
        limit
    };

    if (auctionStart) {
        findObj.where = {
            ...findObj.where,
            auctionStart: {
                [Op.gt]: new Date()
            }
        };
    }

    if (rated) {
        findObj.subQuery = false;
        findObj.include = [
            {
                model: ProductReview,
                attributes: []
            }
        ];
        findObj.attributes = [
            ...findObj.attributes,
            [db.fn('ROUND', db.fn('AVG', db.col('rating')), 2), 'avg_rating']
        ];
        findObj.group = ['Product.id'];
        findObj.order = [[db.fn('ROUND', db.fn('AVG', db.col('rating')), 2), 'DESC']];
    }

    if (hero) {
        findObj.attributes = [...findObj.attributes, 'details'];
    }
    return await Product.findAll(findObj);
};
