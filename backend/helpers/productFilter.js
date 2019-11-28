const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');
const Bid = require('../models/Bid');
const { db, Op } = require('../config/database');
const {
  STARTS_IN_MAX_DAYS,
  ENDS_IN_MAX_DAYS,
  STARTED_DAYS_AGO,
  AVG_RATING,
  LIMIT_SIMILAR_PRODUCTS
} = require('../config/configs');
const { addSubtractDaysToDate } = require('./addSubtractDaysToDate');

function filterProducts({
  type,
  limit,
  offset = 0,
  subcategoryId,
  productId,
  filterValueIds,
  brandId,
  min,
  max,
  orderBy
}) {
  limit = parseInt(limit) ? parseInt(limit) : limit;
  offset = parseInt(offset) ? parseInt(offset) : offset;
  const startsMaxDays = addSubtractDaysToDate(STARTS_IN_MAX_DAYS);
  const endsMaxDays = addSubtractDaysToDate(ENDS_IN_MAX_DAYS);
  const daysAgo = addSubtractDaysToDate(STARTED_DAYS_AGO, false);
  let replacements = null;
  let query = `SELECT p.id, p.name, p.price, p.picture, p."subcategoryId", p.details `;
  let query2 = '';

  if (type === 'topRated') {
    let q = `,ROUND(AVG(pr.rating), 2) AS avg_rating FROM public."Products" p JOIN public."ProductReviews" pr ON pr."productId"=p.id
    GROUP BY p.id HAVING ROUND(AVG(pr.rating), 2) >= ${AVG_RATING} ORDER BY ROUND(AVG(pr.rating), 2)`;
    query += q + ` DESC LIMIT ${limit} OFFSET ${offset};`;
    query2 = 'SELECT COUNT(p.id) as number_of_products ' + q + `;`;
    return { query, query2 };
  }

  if (type === 'heroProduct') {
    query += 'FROM public."Products" p WHERE p."auctionEnd" > NOW() ORDER BY random() ';
  } else {
    query += 'FROM public."Products" p WHERE ';
    query2 += 'SELECT COUNT(p.id) as number_of_products FROM public."Products" p WHERE ';
  }

  if (type === 'featured' || type === 'featuredCollections') {
    query += 'p."auctionEnd" > NOW() AND p.featured=true ';
    query2 = '';
  }

  if (type === 'newArrivals') {
    let q = 'p."auctionStart" > :ago AND p."auctionStart" <= :maxDay AND p."auctionEnd" > NOW() ';
    query += q + 'ORDER BY p."auctionStart" ASC ';
    query2 += q + ';';
    replacements = { ago: daysAgo, maxDay: startsMaxDays };
  }

  if (type === 'lastChance') {
    let q = 'p."auctionEnd" > NOW() AND p."auctionEnd" <= :endsMaxDays ';
    query += q + 'ORDER BY p."auctionEnd" ASC ';
    query2 += q + ';';
    replacements = { endsMaxDays };
  }

  if (type === 'Similar') {
    query += `p."subcategoryId"=${subcategoryId} AND p.id!=${productId} ORDER BY random() `;
  }
  let price =
    type === 'Shop'
      ? `SELECT CASE
    when p.price >= 0 and p.price < 100 then '0-100'
    when p.price >= 100 and p.price < 200 then '100-200'
    when p.price >= 200 and p.price < 300 then '200-300'
    when p.price >= 300 and p.price < 400 then '300-400'
    when p.price >= 400 and p.price < 500 then '400-500'
    when p.price >= 500 and p.price < 600 then '500-600'
    when p.price >= 600 and p.price < 700 then '600-700'
    else '700+' end as price_range, count(1) as count FROM public."Products" p WHERE 
  `
      : null;

  if (type === 'Shop') {
    let q =
      'p."auctionEnd">NOW() AND p.id IN (SELECT p.id FROM public."Products" p JOIN public."FilterValueProducts" fp ON p.id=fp."productId"';
    if (brandId) {
      let q = ` p."brandId"=${brandId} AND `;
      query += q;
      query2 += q;
      price += q;
    }

    if (subcategoryId) {
      let q = ` p."subcategoryId"=${subcategoryId} AND `;
      query += q;
      query2 += q;
      price += q;
    }

    if (min && max) {
      let q = ` p.price>=${min} AND p.price<=${max} AND `;
      query += q;
      query2 += q;
      price += q;
    }

    query += q;
    query2 += q;
    price += q;
    if (filterValueIds.length > 0) {
      let q = ` WHERE fp."filterValueId" IN (${filterValueIds}) GROUP BY p.id HAVING COUNT(fp."filterValueId")=${filterValueIds.length} `;
      query += q;
      query2 += q;
      price += q;
    }
    query += `) `;
    query2 += `);`;
    price += `) group by price_range order by price_range;`;
  }

  if (orderBy) {
    query +=
      orderBy == 'Sort by Price Descending'
        ? ' ORDER BY p.price DESC '
        : orderBy == 'Sort by Price Ascending'
        ? ' ORDER BY p.price ASC '
        : orderBy == 'Sort by Time Left Descending'
        ? ' ORDER BY p."auctionEnd" DESC '
        : orderBy == 'Sort by Time Ascending'
        ? ' ORDER BY p."auctionEnd" ASC '
        : '';
  }
  query += `LIMIT ${limit} OFFSET ${offset};`;

  return { query, query2, replacements, price };
}

exports.getFilteredProducts = async obj => {
  let { query, query2, replacements, price } = filterProducts(obj);
  const products = await db.query(query, {
    replacements,
    type: db.QueryTypes.SELECT
  });
  const numberOfProducts = query2
    ? await db.query(query2, { replacements, type: db.QueryTypes.SELECT })
    : [{ number_of_products: 10 }];
  const priceRange = price && (await db.query(price, { type: db.QueryTypes.SELECT }));
  return {
    products,
    numberOfProducts: numberOfProducts[0].number_of_products,
    priceRange
  };
};

exports.getProductById = async id => {
  return await Product.findOne({
    where: { id, auctionEnd: { [Op.gt]: new Date() } },
    attributes: {
      include: [
        [db.fn('coalesce', db.fn('MAX', db.col('Bids.price')), 0), 'highest_bid'],
        [db.fn('coalesce', db.fn('COUNT', db.col('Bids.price')), 0), 'number_of_bids']
      ],
      exclude: ['featured']
    },
    include: [
      { model: ProductImage, attributes: ['image'] },
      { model: Bid, attributes: [] }
    ],
    group: ['Product.id', 'ProductImages.id']
  });
};

exports.getSimilarProducts = async (subcategoryId, productId) => {
  let { query } = filterProducts({
    limit: LIMIT_SIMILAR_PRODUCTS,
    type: 'Similar',
    subcategoryId,
    productId
  });
  return await db.query(query, { type: db.QueryTypes.SELECT });
};

exports.getAuctionEndProduct = async id => {
  return await Product.findOne({
    raw: true,
    where: { id, auctionEnd: { [Op.gt]: new Date() } },
    attributes: ['auctionEnd', 'price', 'userId']
  });
};

exports.noMoreProducts = ({ limit, offset, productsLength }) => {
  const length = parseInt(productsLength) ? parseInt(productsLength) : productsLength;
  const Limit = parseInt(limit) ? parseInt(limit) : limit;
  const Offset = offset != null ? (parseInt(offset) ? parseInt(offset) : offset) : null;
  const eq = isNaN(Limit + Offset) ? Limit : Limit + Offset;
  return length === 0 || length < Limit || length <= eq ? true : false;
};
