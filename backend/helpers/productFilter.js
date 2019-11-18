const Product = require("../models/Product");
const ProductReview = require("../models/ProductReview");
const ProductImage = require("../models/ProductImage");
const Bid = require("../models/Bid");
const { db, Op } = require("../config/database");
const {
  STARTS_IN_MAX_DAYS,
  ENDS_IN_MAX_DAYS,
  STARTED_DAYS_AGO,
  AVG_RATING,
  LIMIT_SIMILAR_PRODUCTS
} = require("../config/configs");
const { addSubtractDaysToDate } = require("./addSubtractDaysToDate");

function filterProducts({ type, limit, offset = 0 }) {
  limit = parseInt(limit);
  offset = parseInt(offset);
  let findObj = {
    where: {
      auctionEnd: {
        [Op.gt]: new Date()
      }
    },
    attributes: ["id", "name", "price", "picture", "subcategoryId"],
    order: db.random(),
    limit,
    offset
  };

  if (type === "featured" || type === "featuredCollections") {
    findObj.where.featured = true;
  }

  if (type === "newArrivals") {
    findObj.where.auctionStart = {
      [Op.gt]: addSubtractDaysToDate(STARTED_DAYS_AGO, false),
      [Op.lte]: addSubtractDaysToDate(STARTS_IN_MAX_DAYS)
    };
    findObj.order = [["auctionStart", "ASC"]];
  }

  if (type === "lastChance") {
    findObj.where.auctionEnd = {
      [Op.gt]: new Date(),
      [Op.lte]: addSubtractDaysToDate(ENDS_IN_MAX_DAYS)
    };
    findObj.order = [["auctionEnd", "ASC"]];
  }

  if (type === "topRated") {
    findObj.subQuery = false;
    findObj.include = [
      {
        model: ProductReview,
        attributes: []
      }
    ];
    findObj.attributes.push([
      db.fn("ROUND", db.fn("AVG", db.col("rating")), 2),
      "avg_rating"
    ]);
    findObj.having = db.where(
      db.fn("ROUND", db.fn("AVG", db.col("rating")), 2),
      {
        [Op.gte]: AVG_RATING
      }
    );
    findObj.group = ["Product.id"];
    findObj.order = [
      [db.fn("ROUND", db.fn("AVG", db.col("rating")), 2), "DESC"]
    ];
  }

  if (type === "heroProduct") {
    findObj.attributes.push("details");
  }

  return { ...findObj };
}

exports.getFilteredProducts = async obj => {
  let filterObject = filterProducts(obj);
  const products = await Product.findAll(filterObject);
  delete filterObject.limit;
  delete filterObject.offset;
  const numberOfProducts = await Product.findAll(filterObject);
  return { products, numberOfProducts: numberOfProducts.length };
};

exports.getProductById = async id => {
  return await Product.findOne({
    where: {
      id,
      auctionEnd: {
        [Op.gt]: new Date()
      }
    },
    attributes: {
      include: [
        [
          db.fn("coalesce", db.fn("MAX", db.col("Bids.price")), 0),
          "highest_bid"
        ],
        [
          db.fn("coalesce", db.fn("COUNT", db.col("Bids.price")), 0),
          "number_of_bids"
        ]
      ],
      exclude: ["featured"]
    },
    include: [
      {
        model: ProductImage,
        attributes: ["image"]
      },
      {
        model: Bid,
        attributes: []
      }
    ],
    group: ["Product.id", "ProductImages.id"]
  });
};

exports.getSimilarProducts = async (subcategoryId, productId) => {
  let findObj = filterProducts({ limit: LIMIT_SIMILAR_PRODUCTS });
  findObj.where = {
    ...findObj.where,
    subcategoryId,
    id: {
      [Op.not]: productId
    }
  };
  return await Product.findAll(findObj);
};

exports.getAuctionEndProduct = async id => {
  return await Product.findOne({
    raw: true,
    where: {
      id,
      auctionEnd: {
        [Op.gt]: new Date()
      }
    },
    attributes: ["auctionEnd", "price", "userId"]
  });
};
