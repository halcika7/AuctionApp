const { Op } = require('../config/database');
const { removeNullProperty } = require('./removeNullProperty');

module.exports.returnWhereObject = ({ min, max, subcategoryId, brandId }, auctionEnd) => {
  const obj = {
    ...removeNullProperty({ subcategoryId, brandId })
  };
  if (min && max) {
    obj['price'] = {
      [Op.and]: {
        [Op.gte]: min,
        [Op.lte]: max
      }
    };
  }
  if (auctionEnd) {
    obj['auctionEnd'] = {
      [Op.gt]: new Date()
    };
  }
  return obj;
};
