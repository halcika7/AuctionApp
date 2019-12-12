const addressValidator = require('address-validator');
const { GOOGLE_MAPS_KEY } = require('./configs');
addressValidator.setOptions({ key: GOOGLE_MAPS_KEY });
const Address = addressValidator.Address;

module.exports = { Address, addressValidator };
