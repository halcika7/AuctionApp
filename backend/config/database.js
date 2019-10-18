const Sequelize = require('sequelize');

module.exports = new Sequelize('auctionapp', 'postgres', 'volimtejaa7', {
    host: 'localhost',
    port: 5433,
    dialect: 'postgres',
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

// sequelize.sync({ force: true }).then(() => {
//     console.log(`Database & tables created!`);
// });

// module.exports = sequelize;
