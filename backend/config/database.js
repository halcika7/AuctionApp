const { Sequelize, Op } = require("sequelize");
const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  DB_HOST,
  DB_NAME
} = require("./configs");

const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
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
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

module.exports = { db, Op };
