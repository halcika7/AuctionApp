const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const BrandSubcategory = require('../models/BrandSubcategory');
const CardInfoService = require('../services/CardInfoService');
const FilterService = require('../services/FilterService');
const StripeService = require('../services/StripeService');
const { MAX_BID } = require('../config/configs');
const { addSubtractDaysToDate } = require('../helpers/addSubtractDaysToDate');
const { client } = require('../config/twilioConfig');

exports.addProductValidation = async (
  {
    productData,
    addressInformation,
    cardInformation,
    categoryData,
    subcategoryData,
    brandData,
    filtersData
  },
  userId,
  images
) => {
  let errors = {};

  const nameNumberOfWords = productData.name
    ? productData.name.split(' ').filter(n => n != '').length
    : 0;

  //product name validation
  if (!productData.name) {
    errors.name = 'Product name is required';
  } else if (nameNumberOfWords < 1 || nameNumberOfWords > 10) {
    errors.name = 'Please enter between 1 and 10 words';
  } else if (productData.name.length > 60) {
    errors.name = 'Please enter product name that is not longer than 60 characters.';
  }

  const isCategoryValid = await validateCategSubcategBrand(
    errors,
    categoryData,
    Category,
    'category',
    { id: categoryData.id }
  );

  const isSubcategoryValid = await validateCategSubcategBrand(
    errors,
    subcategoryData,
    Subcategory,
    'subcategory',
    { id: subcategoryData.id, CategoriesId: categoryData.id },
    isCategoryValid
  );

  await validateCategSubcategBrand(
    errors,
    brandData,
    BrandSubcategory,
    'brand',
    { brandId: brandData.id, subcategoryId: subcategoryData.id },
    isSubcategoryValid
  );

  await filterValidation(isSubcategoryValid, subcategoryData.id, filtersData, errors);

  //product description validation
  if (!productData.description) {
    errors.description = 'Product description is required';
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

  validateDates(productData.startDate, productData.endDate, errors);

  await addressValidation(addressInformation, errors);

  const choosenCardToken = await creditCardValidation(cardInformation, userId, errors);

  return { errors: { errors }, isValid: isEmpty(errors), choosenCardToken };
};

const validateCategSubcategBrand = async (errors, data, model, property, where, isValid = true) => {
  let validModel = false;

  if (!data.id || !data.name) {
    errors[property] = `${property.charAt(0).toUpperCase()}${property.slice(1)} is required`;
  } else {
    if (!isValid) return;

    const modelFound = await model.findOne({ where: { ...where } });

    if (!modelFound) {
      errors[property] = `Please select valid ${property}`;
    } else {
      validModel = true;
    }
  }

  return validModel;
};

const filterValidation = async (isSubcategoryValid, id, filtersData, errors) => {
  if (!isSubcategoryValid) return;

  let filterErrors = [];
  const Filters = await FilterService.findFilters(id);

  Filters.forEach((filter, index) => {
    const findFilter = filtersData.find(filterData => filterData.parentId == filter.id);

    if (!findFilter) {
      filterErrors.push(`Filter ${filter.name} is required`);
    } else {
      const findFilterValue = filter.FilterValues.find(
        ({ id, value }) => id == filtersData[index].id && value == filtersData[index].name
      );

      !findFilterValue
        ? filterErrors.push(`Please select valid value for filter ${filter.name}`)
        : filterErrors.push('');
    }
  });

  if (filterErrors.find(error => error != '')) {
    errors.filterErrors = filterErrors;
  }
};

const addressValidation = async (addressInformation, errors) => {
  const { address, city, country, phone, zip } = addressInformation;

  if (!address) errors.address = 'Address is required';
  if (!city) errors.city = 'City is required';
  if (!country) errors.country = 'Country is required';

  if (!phone) {
    errors.phone = 'Phone is required';
  } else {
    try {
      await client.lookups.phoneNumbers(phone).fetch({ type: ['carrier'] });
    } catch (error) {
      errors.phone = error.message + '. Please use valid country code.';
    }
  }

  if (!zip) errors.zip = 'Zip is required';
};

const creditCardValidation = async (cardInformation, userId, errors) => {
  let choosenCardToken = '';
  const { cvc, name, number, exp_year, exp_month } = cardInformation;

  if (!cardInformation.useCard) {
    if (!cvc) errors.CVC = 'CVC is required';
    if (!name) errors.cName = 'Name on card is required';
    if (!number) errors.cNumber = 'Card number is required';
    if (!exp_year) errors.exp_year = 'Expiration year is required';
    if (!exp_month) errors.exp_month = 'Expiration month is required';

    if (cvc && name && number && exp_year && exp_month) {
      try {
        delete cardInformation.useCard;
        const { valid, id } = await StripeService.validateCard(errors, userId, cardInformation);
        choosenCardToken = valid ? id : '';
      } catch (error) {
        errors.card = error.message;
      }
    }
  } else {
    const { customerId } = await CardInfoService.findUserCardInfo(userId);

    if (!customerId) {
      errors.card = 'Please provide valid credit card information';
    } else {
      choosenCardToken = {
        customer: customerId
      };
    }
  }
  
  return choosenCardToken;
};

const validateDates = (productStartDate, productEndDate, errors) => {
  const startDate = validateDate(productStartDate, 'startDate', 'start date', errors);
  if (startDate < new Date() && !errors.startDate) {
    errors.startDate =
      'Auction cannot start in the past. Please choose tomorrow or some other date in the future';
  }

  const endDate = validateDate(productEndDate, 'endDate', 'end date', errors);
  if (!(endDate > addSubtractDaysToDate(1)) && !errors.endDate) {
    errors.endDate = 'Auction should end at least a day after auction start date';
  }
};

const validateDate = (date, property, respMessage, errors) => {
  const addedOneHour = new Date(date);
  addedOneHour.setTime(addedOneHour.getTime() + 60 * 60 * 1000);

  if (!date) {
    errors[property] = `${respMessage.charAt(0).toUpperCase()}${respMessage.slice(1)} is required`;
  } else if (
    Object.prototype.toString.call(addedOneHour) != '[object Date]' ||
    isNaN(addedOneHour.getTime())
  ) {
    errors[property] = `Please choose valid ${respMessage}`;
  }

  return addedOneHour;
};
