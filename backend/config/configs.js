const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  URL: process.env.URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  DB_USERNAME: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  ENDS_IN_MAX_DAYS: 3,
  STARTS_IN_MAX_DAYS: 7,
  STARTED_DAYS_AGO: 1,
  AVG_RATING: 3,
  LIMIT_SIMILAR_PRODUCTS: 3,
  LIMIT_BIDS: 10,
  MAX_BID: 20000,
  LIMIT_SHOP_PRODUCTS: 9,
  DEFAULT_LIMIT_PRODUCTS: 8,
  SEND_GRID: process.env.SEND_GRID,
  CLOUDINARY_CLOUD: process.env.CLOUDINARY_CLOUD,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  TWILIO_SID: process.env.TWILIO_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  STRIPE_KEY: process.env.STRIPE_KEY,
  DEFAULT_USER_IMAGE: 'https://static.thenounproject.com/png/363633-200.png',
  FEATURING_PRODUCT_COST: 1000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK:
    process.env.NODE_ENV === 'production'
      ? 'https://polar-lake-39918.herokuapp.com/api/auth/google/callback'
      : '/api/auth/google/callback',
  FACEBOOK_CALLBACK:
    process.env.NODE_ENV === 'production'
      ? 'https://polar-lake-39918.herokuapp.com/api/auth/facebook/callback'
      : '/api/auth/facebook/callback',
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  NEVERBOUNCE_URL: `https://api.neverbounce.com/v4/single/check?key=${process.env.NEVERBOUNCE_API_KEY}`,
  TOKEN_DURATION: '1d'
};
