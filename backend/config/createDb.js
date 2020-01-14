const { Pool } = require('pg');
const { DB_USERNAME, DB_PASSWORD, DB_PORT, DB_HOST, DB_NAME } = require('./configs');
const pg = new Pool({
  connectionString: `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/postgres`
});

pg.connect()
  .then(client => {
    client
      .query(`CREATE DATABASE ${DB_NAME}`)
      .then(() => {
        console.log('db created');
        client
          .query(`ALTER USER postgres SET timezone='UTC'`)
          .then(() => {
            console.log('timezone set to UTC');
            process.kill(process.pid);
          })
          .catch(err => {
            console.log('timezone not set to UTC');
            process.kill(process.pid);
          });
      })
      .catch(err => {
        console.log('db exists');
        process.kill(process.pid);
      });
  })
  .catch(err => {
    console.log('TCL: err', err);
    console.log('unable to connect to postgres db');
    process.kill(process.pid);
  });
