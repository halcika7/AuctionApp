exports.addProductValidation = async ({
  productData,
  addressInformation,
  cardInformation,
  categoryData,
  subcategoryData,
  brandData,
  filtersData
}) => {
  return { errors: { errors }, isValid: isEmpty(errors) };
};
