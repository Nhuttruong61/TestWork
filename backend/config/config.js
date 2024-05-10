require("dotenv").config();
module.exports = {
  development: {
    username: process.env.USER,
    password: null,
    database: process.env.DATANAME,
    host: process.env.HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: "+07:00",
  },
};
