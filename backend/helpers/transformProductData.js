module.exports.transformProductData = (
  productData,
  image,
  brandData,
  subcategoryData,
  userId
) => {
  productData.picture = image;
  productData.details = productData.description;
  productData.subcategoryId = subcategoryData.id;
  productData.brandId = brandData.id;
  productData.userId = userId;
  productData.auctionStart = new Date(productData.startDate);
  productData.auctionStart.setTime(productData.auctionStart.getTime() + 60 * 60 * 1000);
  productData.auctionEnd = new Date(productData.endDate);
  productData.auctionEnd.setTime(productData.auctionEnd.getTime() + 60 * 60 * 1000);
  delete productData.description;
  delete productData.endDate;
  delete productData.startDate;
  return productData;
};
