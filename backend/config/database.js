const Sequelize = require('sequelize');
Sequelize.cre;
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
    define: {
        timestamps: false
    }
});

db.sync();

db.authenticate()
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

module.exports = db;
