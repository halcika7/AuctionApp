const { Pool } = require('pg');
const { DB_USERNAME, DB_PASSWORD, DB_PORT } = require('./configs');
const pg = new Pool({
    connectionString: `postgres://${DB_USERNAME}:${DB_PASSWORD}@localhost:${DB_PORT}/postgres`
});

pg.connect()
    .then(client => {
        client
            .query('CREATE DATABASE auctionapp')
            .then(() => {
                console.log('db created');
            })
            .catch(err => {
                console.log('db exists');
            });
    })
    .catch(err => {
        console.log('TCL: err', err);
        console.log('error');
    });
