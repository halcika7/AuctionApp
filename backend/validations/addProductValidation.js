const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const BrandSubcategory = require('../models/BrandSubcategory');
const { MAX_BID } = require('../config/configs');
const { addSubtractDaysToDate } = require('../helpers/addSubtractDaysToDate');
const { userCardValidation } = require('./updateUsersProfile');

exports.addProductValidation = async (
  {
    productData, addressInformation,
    cardInformation, categoryData,
    subcategoryData, brandData,
    filtersData
  },
  userId, images
) => {
  let errors = {};
  const nameNumberOfWords = productData.name
    ? productData.name.split(' ').filter(n => n != '').length
    : 0;

  const descriptionNumberOfWords = productData.name
    ? productData.name.split(' ').filter(n => n != '').length
    : 0;

  const validCategory = await Category.findOne({ where: { id: categoryData.id } });

  const validSubcategory = await Subcategory.findOne({
    where: { id: subcategoryData.id, CategoriesId: categoryData.id }
  });

  const validBrand = await BrandSubcategory.findOne({
    where: { brandId: brandData.id, subcategoryId: subcategoryData.id }
  });
  
  const startDate = new Date(productData.startDate);
  startDate.setTime(startDate.getTime() + 60 * 60 * 1000);

  const endDate = new Date(productData.endDate);
  endDate.setTime(endDate.getTime() + 60 * 60 * 1000);

  //product name validation
  if (!productData.name) {
    errors.name = 'Product name is required';
  } else if (nameNumberOfWords < 2 || nameNumberOfWords > 5) {
    errors.name = 'Please enter between 2 and 5 words';
  } else if (productData.name.length > 60) {
    errors.name = 'Please enter product name that is not longer than 60 characters.';
  }

  //category validation
  if (!categoryData.id || !categoryData.name) {
    errors.category = 'Category is required';
  } else if (!validCategory) {
    errors.category = 'Please select valid category';
  }

  //subcategory validation
  if (!subcategoryData.id || !subcategoryData.name) {
    errors.subcategory = 'Subcategory is required';
  } else if (!validSubcategory) {
    errors.subcategory = 'Please select valid subcategory';
  }

  //brand validation
  if (!brandData.id || !brandData.name) {
    errors.brand = 'Brand is required';
  } else if (!validBrand) {
    errors.brand = 'Please select valid brand';
  }

  //filters validation
  if (validSubcategory) {
  }

  //product description validation
  if (!productData.description) {
    errors.description = 'Product description is required';
  } else if (descriptionNumberOfWords < 100) {
    errors.description = 'Please enter at least 100 words';
  } else if (productData.description.length > 700) {
    errors.description = 'Please enter product description that is not longer than 700 characters.';
  }

  //images validation
  if (images.length == 0) {
    errors.images = 'Product images are required';
  } else if (images.length < 3) {
    errors.images = 'Upload at least 3 photos';
  } else if (images.length > 20) {
    errors.images = 'Upload at most 20 photos';
  }

  //price validation
  if (!productData.price) {
    errors.price = 'Price is required';
  } else if (productData.price < 1) {
    errors.price = 'Price should be at least $1.00';
  } else if (productData.price >= MAX_BID) {
    errors.price = `Price should be less than $${MAX_BID}`;
  }

  //start date validation
  if (!productData.startDate) {
    errors.startDate = 'Start date is required';
  } else if (
    Object.prototype.toString.call(startDate) != '[object Date]' ||
    isNaN(startDate.getTime())
  ) {
    errors.startDate = 'Please choose valid start date';
  } else if (startDate < new Date()) {
    errors.startDate =
      'Auction cannot start in the past. Please choose current date or some other date in the future';
  }

  //end date validation
  if (!productData.endDate) {
    errors.endDate = 'End date is required';
  } else if (
    Object.prototype.toString.call(endDate) != '[object Date]' ||
    isNaN(endDate.getTime())
  ) {
    errors.endDate = 'Please choose valid end date';
  } else if (endDate < new Date()) {
    errors.endDate =
      'Auction cannot end in the past. Please choose tommorow or some other date in the future';
  } else if (!(endDate >= addSubtractDaysToDate(1))) {
    errors.endDate = 'Auction sould end at least tommorow or some other date in the future';
  }

  // address validation
  if (!addressInformation.address) {
    errors.address = 'Address is required';
  }

  if (!addressInformation.city) {
    errors.city = 'City is required';
  }

  if (!addressInformation.country) {
    errors.country = 'Country is required';
  }

  if (!addressInformation.phone) {
    errors.phone = 'Phone is required';
  }

  if (!addressInformation.zip) {
    errors.zip = 'Zip is required';
  }

  //credit card validation
  if (!cardInformation.useCard) {
    if (!cardInformation.cvc) {
      errors.cvc = 'CVC is required';
    }

    if (!cardInformation.cName) {
      errors.cName = 'Name on card is required';
    }

    if (!cardInformation.number) {
      errors.cNumber = 'Card number is required';
    }

    if (!cardInformation.exp_year) {
      errors.exp_year = 'Exparation year is required';
    }

    if (!cardInformation.exp_month) {
      errors.cvc = 'Exparation month is required';
    }

    delete cardInformation.useCard;

    const {isValid, errors:cardErrors, cardInfoData} = await userCardValidation(cardInformation, userId, errors);

    if(!isValid) {
      errors.card = cardErrors.card;
    }
  } else {

  }

  return { errors: { errors }, isValid: isEmpty(errors) };
};
