const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const BrandSubcategory = require('../models/BrandSubcategory');
const Filter = require('../models/Filter');
const FilterValue = require('../models/FilterValue');
const FilterSubcategory = require('../models/FilterSubcategory');
const CardInfo = require('../models/CardInfo');
const { MAX_BID } = require('../config/configs');
const { addSubtractDaysToDate } = require('../helpers/addSubtractDaysToDate');
const { userCardValidation } = require('./updateUsersProfile');
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
  let choosenCardToken = '';
  let isCategoryValid = false;
  let isSubcategoryValid = false;
  let isBrandValid = false;
  const nameNumberOfWords = productData.name
    ? productData.name.split(' ').filter(n => n != '').length
    : 0;

  const descriptionNumberOfWords = productData.description
    ? productData.description.split(' ').filter(n => n != '').length
    : 0;

  const startDate = new Date(productData.startDate);
  startDate.setTime(startDate.getTime() + 60 * 60 * 1000);

  const endDate = new Date(productData.endDate);
  endDate.setTime(endDate.getTime() + 60 * 60 * 1000);

  const { address, city, country, phone, zip } = addressInformation;

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
  } else {
    const validCategory = await Category.findOne({ where: { id: categoryData.id } });
    if (!validCategory) {
      errors.category = 'Please select valid category';
    } else {
      isCategoryValid = true;
    }
  }

  //subcategory validation
  if (!subcategoryData.id || !subcategoryData.name) {
    errors.subcategory = 'Subcategory is required';
  } else {
    if (isCategoryValid) {
      const validSubcategory = await Subcategory.findOne({
        where: { id: subcategoryData.id, CategoriesId: categoryData.id }
      });
      if (!validSubcategory) {
        errors.subcategory = 'Please select valid subcategory';
      } else {
        isSubcategoryValid = true;
      }
    }
  }

  //brand validation
  if (!brandData.id || !brandData.name) {
    errors.brand = 'Brand is required';
  } else {
    if (isSubcategoryValid) {
      const validBrand = await BrandSubcategory.findOne({
        where: { brandId: brandData.id, subcategoryId: subcategoryData.id }
      });
      if (!validBrand) {
        errors.brand = 'Please select valid brand';
      }
    }
  }

  //filters validation
  if (isSubcategoryValid) {
    let filterErrors = [];
    const { Filters } = await Subcategory.findOne({
      where: {
        id: subcategoryData.id
      },
      attributes: [],
      include: {
        model: Filter,
        attributes: ['id', 'name'],
        through: {
          model: FilterSubcategory,
          attributes: []
        },
        include: {
          model: FilterValue,
          attributes: ['value', 'id']
        }
      }
    });
    Filters.forEach((filter, index) => {
      const findFilter = filtersData.find(filterData => filterData.parentId == filter.id);
      if (!findFilter) {
        filterErrors.push(`Filter ${filter.name} is required`);
      } else {
        const findFilterValue = filter.FilterValues.find(
          ({ id, value }) => id == filtersData[index].id && value == filtersData[index].name
        );
        if (!findFilterValue) {
          filterErrors.push(`Please select valid value for filter ${filter.name}`);
        } else {
          filterErrors.push('');
        }
      }
    });

    if (filterErrors.find(error => error != '')) {
      errors.filterErrors = filterErrors;
    }
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
      'Auction cannot start in the past. Please choose tomorrow or some other date in the future';
  }

  //end date validation
  if (!productData.endDate) {
    errors.endDate = 'End date is required';
  } else if (
    Object.prototype.toString.call(endDate) != '[object Date]' ||
    isNaN(endDate.getTime())
  ) {
    errors.endDate = 'Please choose valid end date';
  } else if (!(endDate > addSubtractDaysToDate(1))) {
    errors.endDate = 'Auction should end at least a day after auction start date';
  }

  // address validation
  if (!address) {
    errors.address = 'Address is required';
  }
  if (!city) {
    errors.city = 'City is required';
  }
  if (!country) {
    errors.country = 'Country is required';
  }
  if (!phone) {
    errors.phone = 'Phone is required';
  } else {
    try {
      await client.lookups.phoneNumbers(phone).fetch({ type: ['carrier'] });
    } catch (error) {
      errors.phone = error.message + '. Please use valid country code.';
    }
  }
  if (!zip) {
    errors.zip = 'Zip is required';
  }

  //credit card validation
  if (!cardInformation.useCard) {
    const { cvc, name, number, exp_year, exp_month } = cardInformation;
    if (!cvc) {
      errors.CVC = 'CVC is required';
    }

    if (!name) {
      errors.cName = 'Name on card is required';
    }

    if (!number) {
      errors.cNumber = 'Card number is required';
    }

    if (!exp_year) {
      errors.exp_year = 'Exparation year is required';
    }

    if (!exp_month) {
      errors.exp_month = 'Exparation month is required';
    }

    if (cvc && name && number && exp_year && exp_month) {
      delete cardInformation.useCard;
      const {
        isValid,
        errors: cardErrors,
        cardInfoData: { cardToken }
      } = await userCardValidation(cardInformation, userId, errors);

      if (!isValid) {
        errors.card = cardErrors.card;
      } else {
        choosenCardToken = cardToken;
      }
    }
  } else {
    const { customerId, cardId } = await CardInfo.findOne({
      raw: true,
      subQuery: false,
      where: { id: userId },
      attributes: ['customerId']
    });
    if (!customerId) {
      errors.card = 'Please provide valid credit card information';
    } else {
      choosenCardToken = {
        customer: customerId,
        source: cardId
      };
    }
  }

  return { errors: { errors }, isValid: isEmpty(errors), choosenCardToken };
};
