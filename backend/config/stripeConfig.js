const { STRIPE_KEY } = require('./configs')
const stripe = require('stripe')(STRIPE_KEY);

module.exports = stripe;