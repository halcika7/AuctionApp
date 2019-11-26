const BaseService = require('./BaseService');
const Subcategory = require('../models/Subcategory');
const BrandSubcategory = require('../models/BrandSubcategory');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Filter = require('../models/Filter');
const FilterValue = require('../models/FilterValue');
const FilterValueProduct = require('../models/FilterValueProduct');
const FilterSubcategory = require('../models/FilterSubcategory');
const { db, Op } = require('../config/database');
const { removeNullProperty } = require('../helpers/removeNullProperty');
const { LIMIT_SHOP_PRODUCTS } = require('../config/configs');

class ShopService extends BaseService {
  constructor() {
    super(ShopService);
  }

  async getSubcategoryBrands({ min, max, subcategoryId }) {
    try {
      const where = {
        ...removeNullProperty({
          subcategoryId,
          price:
            min && max
              ? {
                  ...removeNullProperty({
                    [Op.and]: {
                      [Op.gte]: min,
                      [Op.lte]: max
                    }
                  })
                }
              : null
        })
      };
      const { Brands } =
        subcategoryId != undefined
          ? await Subcategory.findOne({
              where: {
                id: subcategoryId
              },
              attributes: [],
              include: [
                {
                  model: Brand,
                  as: 'Brands',
                  through: {
                    model: BrandSubcategory,
                    attributes: []
                  },
                  include: [
                    {
                      model: Product,
                      where: {
                        ...where,
                        auctionEnd: {
                          [Op.gt]: new Date()
                        }
                      },
                      attributes: []
                    }
                  ],
                  attributes: [
                    'id',
                    'name',
                    [db.fn('COUNT', db.col('Brands.Products.id')), 'number_of_products']
                  ]
                }
              ],
              group: ['Subcategory.id', 'Brands.id', 'Brands->BrandSubcategories.id']
            })
          : {
              Brands: await Brand.findAll({
                include: {
                  model: Product,
                  where: {
                    ...where,
                    auctionEnd: {
                      [Op.gt]: new Date()
                    }
                  },
                  attributes: []
                },
                attributes: [
                  'id',
                  'name',
                  [db.fn('COUNT', db.col('Products.id')), 'number_of_products']
                ],
                group: ['Brand.id']
              })
            };
      return { status: 200, Brands };
    } catch (error) {
      return {
        status: 403,
        failedMessage: 'Something happened. We were unable to perform request.'
      };
    }
  }

  async getPrices({ subcategoryId, brandId }) {
    try {
      const where = {
        ...removeNullProperty({
          subcategoryId,
          brandId
        })
      };
      const prices = await Product.findOne({
        where: {
          ...where,
          auctionEnd: {
            [Op.gt]: new Date()
          }
        },
        attributes: [
          [db.fn('ROUND', db.fn('AVG', db.cast(db.col('price'), 'numeric')), 2), 'avg_price'],
          [db.fn('MAX', db.col('price')), 'max_price'],
          [db.fn('MIN', db.col('price')), 'min_price']
        ]
      });

      let counts = [];

      for (let i = 0; i < 20; i++) {
        let price =
          i === 0
            ? {
                [Op.and]: {
                  [Op.gte]: 0,
                  [Op.lt]: 100
                }
              }
            : i === 19
            ? {
                [Op.and]: {
                  [Op.gte]: 100 * i
                }
              }
            : {
                [Op.and]: {
                  [Op.gte]: 100 * i,
                  [Op.lt]: 100 * (i + 1)
                }
              };
        counts.push(
          await Product.findOne({
            raw: true,
            where: {
              ...where,
              price
            },
            attributes: [[db.fn('COUNT', db.col('id')), 'count']]
          })
        );
      }
      counts = counts.map(cts => cts.count);

      return { status: 200, prices, counts };
    } catch (error) {
      return {
        status: 403,
        failedMessage: 'Something happened. We were unable to perform request.'
      };
    }
  }

  async getFilters({ min, max, subcategoryId, brandId }) {
    try {
      const where = {
        ...removeNullProperty({
          subcategoryId,
          brandId,
          price:
            min && max
              ? {
                  ...removeNullProperty({
                    [Op.and]: {
                      [Op.gte]: min,
                      [Op.lte]: max
                    }
                  })
                }
              : null
        })
      };
      const { Filters } =
        subcategoryId != undefined
          ? await Subcategory.findOne({
              where: {
                id: subcategoryId
              },
              include: {
                model: Filter,
                through: {
                  model: FilterSubcategory,
                  attributes: []
                },
                include: {
                  model: FilterValue,
                  attributes: ['value', 'id'],
                  include: {
                    model: Product,
                    where: {
                      ...where,
                      auctionEnd: {
                        [Op.gt]: new Date()
                      }
                    },
                    attributes: ['id'],
                    through: {
                      model: FilterValueProduct,
                      attributes: []
                    }
                  }
                }
              },
              attributes: []
            })
          : { Filters: [] };
      return { status: 200, Filters };
    } catch (error) {
      return {
        status: 403,
        failedMessage: 'Something happened. We were unable to perform request.'
      };
    }
  }

  async getProducts(productWhere, { filterValueIds }) {
    try {
      const { min, max, subcategoryId, brandId, offSet } = { ...removeNullProperty(productWhere) };

      const where = {
        ...removeNullProperty({
          subcategoryId,
          brandId,
          price:
            min && max
              ? {
                  ...removeNullProperty({
                    [Op.and]: {
                      [Op.gte]: min,
                      [Op.lte]: max
                    }
                  })
                }
              : null
        })
      };

      const whereId =
        filterValueIds.length > 0
          ? {
              id: {
                [Op.in]: filterValueIds
              }
            }
          : {};

      const products = await Product.findAll({
        where: {
          ...where,
          auctionEnd: {
            [Op.gt]: Date.now()
          }
        },
        attributes: ['id', 'name', 'price', 'picture', 'details', 'subcategoryId'],
        include: {
          model: FilterValue,
          as: 'FilterValues',
          through: {
            model: FilterValueProduct,
            attributes: []
          },
          where: { ...whereId },
          attributes: []
        },
        limit: LIMIT_SHOP_PRODUCTS,
        offset: offSet,
        // logging: console.log
      });
      return { status: 200, products };
    } catch (error) {
      return {
        status: 403,
        failedMessage: 'Something happened. We were unable to perform request.'
      };
    }
  }
}

const ShopServiceInstance = new ShopService();

module.exports = ShopServiceInstance;

// SELECT 
//   "Product".*, 
//   "FilterValues->FilterValueProducts"."id" AS "FilterValues.FilterValueProducts.id", 
//   "FilterValues->FilterValueProducts"."filterValueId" AS "FilterValues.FilterValueProducts.filterValueId", 
//   "FilterValues->FilterValueProducts"."productId" AS "FilterValues.FilterValueProducts.productId" 
// FROM (
//   SELECT 
//     "Product"."id", 
//     "Product"."name", 
//     "Product"."price", 
//     "Product"."picture", 
//     "Product"."details", 
//     "Product"."subcategoryId" 
//     FROM "Products" AS "Product" 
//     WHERE "Product"."subcategoryId" = '1' 
//       AND "Product"."auctionEnd" > '2019-11-26 14:37:38.719 +00:00' 
//       AND ( 
//         SELECT "FilterValueProducts"."id" 
//         FROM "FilterValueProducts" AS "FilterValueProducts" 
//         INNER JOIN "FilterValues" AS "FilterValue" ON "FilterValueProducts"."filterValueId" = "FilterValue"."id" 
//         WHERE ("Product"."id" = "FilterValueProducts"."productId") 
//         LIMIT 1 
//       ) 
//     IS NOT NULL 
//     LIMIT 9 
//     OFFSET 0
// ) AS "Product" 
// INNER JOIN ( 
//   "FilterValueProducts" AS "FilterValues->FilterValueProducts" 
//   INNER JOIN "FilterValues" AS "FilterValues" ON "FilterValues"."id" = "FilterValues->FilterValueProducts"."filterValueId"
// ) ON "Product"."id" = "FilterValues->FilterValueProducts"."productId";
