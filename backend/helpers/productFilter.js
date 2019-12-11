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
  let findProductsQuery = `SELECT p.id, p.name, p.price, p.picture, p."subcategoryId", p.details `;
  let numberOfProductsQuery = '';
  let priceRangeQuery =
    type === 'Shop'
      ? `SELECT CASE
  when p.price >= 0 and p.price < 50 then '0-50'
  when p.price >= 50 and p.price < 100 then '50-100'
  when p.price >= 100 and p.price < 150 then '100-150'
  when p.price >= 150 and p.price < 200 then '150-200'
  when p.price >= 200 and p.price < 250 then '200-250'
  when p.price >= 250 and p.price < 300 then '250-300'
  when p.price >= 300 and p.price < 350 then '300-350'
  when p.price >= 350 and p.price < 400 then '350-400'
  when p.price >= 400 and p.price < 450 then '400-450'
  when p.price >= 450 and p.price < 500 then '450-500'
  when p.price >= 500 and p.price < 550 then '500-550'
  when p.price >= 550 and p.price < 600 then '550-600'
  when p.price >= 600 and p.price < 650 then '600-650'
  when p.price >= 650 and p.price < 700 then '650-700'
  when p.price >= 700 and p.price < 750 then '700-750'
  when p.price >= 750 and p.price < 800 then '750-800'
  when p.price >= 800 and p.price < 850 then '800-850'
  when p.price >= 850 and p.price < 900 then '850-900'
  else '900+' end as price_range, count(1) as count FROM public."Products" p WHERE 
`
      : null;

  if (type === 'topRated') {
    let q = `,ROUND(AVG(pr.rating), 2) AS avg_rating FROM public."Products" p JOIN public."ProductReviews" pr ON pr."productId"=p.id
    WHERE p."auctionEnd" > NOW() GROUP BY p.id HAVING ROUND(AVG(pr.rating), 2) >= ${AVG_RATING} ORDER BY ROUND(AVG(pr.rating), 2)`;
    findProductsQuery += q + ` DESC LIMIT ${limit} OFFSET ${offset};`;
    numberOfProductsQuery = 'SELECT COUNT(p.id) as number_of_products ' + q + `;`;
    return { findProductsQuery, numberOfProductsQuery };
  }

  if (type === 'heroProduct') {
    findProductsQuery += 'FROM public."Products" p WHERE p."auctionEnd" > NOW() ORDER BY random() ';
  } else {
    findProductsQuery += 'FROM public."Products" p WHERE ';
    numberOfProductsQuery +=
      'SELECT COUNT(p.id) as number_of_products FROM public."Products" p WHERE ';
  }

  if (type === 'featured' || type === 'featuredCollections') {
    findProductsQuery += 'p."auctionEnd" > NOW() AND p.featured=true ORDER BY random() ';
    numberOfProductsQuery = '';
  }

  if (type === 'newArrivals') {
    let q = 'p."auctionStart" > :ago AND p."auctionStart" <= :maxDay AND p."auctionEnd" > NOW() ';
    findProductsQuery += q + 'ORDER BY p."auctionStart" ASC ';
    numberOfProductsQuery += q + ';';
    replacements = { ago: daysAgo, maxDay: startsMaxDays };
  }

  if (type === 'lastChance') {
    let q = 'p."auctionEnd" > NOW() AND p."auctionEnd" <= :endsMaxDays ';
    findProductsQuery += q + 'ORDER BY p."auctionEnd" ASC ';
    numberOfProductsQuery += q + ';';
    replacements = { endsMaxDays };
  }

  if (type === 'Similar') {
    findProductsQuery += `p."subcategoryId"=${subcategoryId} AND p.id!=${productId} AND p."auctionEnd" > NOW() ORDER BY random() `;
  }

  if (type === 'Shop') {
    let q =
      'p."auctionEnd">NOW() AND p.id IN (SELECT p.id FROM public."Products" p JOIN public."FilterValueProducts" fp ON p.id=fp."productId"';
    if (brandId) {
      q += ` p."brandId"=${brandId} AND `;
    }

    if (subcategoryId) {
      q += ` p."subcategoryId"=${subcategoryId} AND `;
    }

    if (min && max) {
      q += ` p.price>=${min} AND p.price<=${max} AND `;
    }
    if (filterValueIds.length > 0) {
      q += ` WHERE fp."filterValueId" IN (${filterValueIds}) GROUP BY p.id HAVING COUNT(fp."filterValueId")=${filterValueIds.length} `;
    }
    findProductsQuery += `${q}) `;
    numberOfProductsQuery += `${q});`;
    priceRangeQuery += `${q}) group by price_range order by price_range;`;

    if (orderBy) {
      findProductsQuery +=
        orderBy == 'Sort by Price Descending'
          ? ' ORDER BY p.price DESC '
          : orderBy == 'Sort by Price Ascending'
          ? ' ORDER BY p.price ASC '
          : orderBy == 'Sort by Time Left Descending'
          ? ' ORDER BY p."auctionEnd" DESC '
          : orderBy == 'Sort by Time Left Ascending'
          ? ' ORDER BY p."auctionEnd" ASC '
          : '';
    } else {
      findProductsQuery += ' ORDER BY random() ';
    }
  }

  findProductsQuery += `LIMIT ${limit} OFFSET ${offset};`;

  return { findProductsQuery, numberOfProductsQuery, replacements, priceRangeQuery };
}

exports.getFilteredProducts = async obj => {
  let { findProductsQuery, numberOfProductsQuery, replacements, priceRangeQuery } = filterProducts(
    obj
  );
  const products = await db.query(findProductsQuery, {
    replacements,
    type: db.QueryTypes.SELECT
  });
  const numberOfProducts = numberOfProductsQuery
    ? await db.query(numberOfProductsQuery, { replacements, type: db.QueryTypes.SELECT })
    : [{ number_of_products: 10 }];
  const priceRange =
    priceRangeQuery && (await db.query(priceRangeQuery, { type: db.QueryTypes.SELECT }));
  return {
    products,
    numberOfProducts: numberOfProducts[0].number_of_products,
    priceRange
  };
};

exports.getProductById = async (id, subcategoryId) => {
  return await Product.findOne({
    where: { id, subcategoryId, auctionEnd: { [Op.gt]: new Date() } },
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
  let { findProductsQuery } = filterProducts({
    limit: LIMIT_SIMILAR_PRODUCTS,
    type: 'Similar',
    subcategoryId,
    productId
  });
  return await db.query(findProductsQuery, { type: db.QueryTypes.SELECT });
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
