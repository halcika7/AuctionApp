const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    DB_USERNAME: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD
};
