const { Sequelize } = require("sequelize");
require("dotenv").config();
const sequelize = new Sequelize(process.env.DATANAME, process.env.USER, null, {
  host: process.env.HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
  timezone: "+07:00",
});

const dbConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection data success.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
module.exports = dbConnect;
