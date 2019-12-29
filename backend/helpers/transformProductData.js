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
  console.log('TCL: productData.startDate', productData.startDate)
  productData.auctionStart.setHours(1, 0, 0, 0);
  console.log('TCL: productData.auctionStart', productData.auctionStart)
  productData.auctionEnd = new Date(productData.endDate);
  console.log('TCL: productData.endDate', productData.endDate)
  productData.auctionEnd.setDate(productData.auctionEnd.getDate() + 1);
  productData.auctionEnd.setHours(0, 0, 0, 0);
  console.log('TCL: productData.auctionEnd', productData.auctionEnd)
  
  delete productData.description;
  delete productData.endDate;
  delete productData.startDate;

  return productData;
};
