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
  productData.auctionStart.setHours(1, 0, 0, 0);
  productData.auctionEnd = new Date(productData.endDate);
  productData.auctionEnd.setHours(1, 0, 0, 0);
  
  delete productData.description;
  delete productData.endDate;
  delete productData.startDate;

  return productData;
};
