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
  SEND_GRID: process.env.SEND_GRID,
  CLOUDINARY_CLOUD: process.env.CLOUDINARY_CLOUD,
  CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  TWILIO_SID: process.env.TWILIO_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
};
