const Sequelize = require('sequelize');
const { DB_USERNAME, DB_PASSWORD } = require('./configs');

const db = new Sequelize('auctionapp', DB_USERNAME, DB_PASSWORD, {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idel: 10000
    },
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        timezone: '+05:30'
    },
    timezone: '+05:30',
    define: {
        timestamps: true
    }
});

db.sync();

db.authenticate()
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

module.exports = db;
