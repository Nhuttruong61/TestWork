const express = require("express");
const cors = require("cors");
const initialRouter = require("./routers");
const DataBaseConnect = require("./config/mysql.config");
const CloudinaryConnect = require("./config/cloudinary.config");
require("dotenv").config();
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
const PORT = process.env.PORT;
initialRouter(app);
app.listen(PORT || 8000, () => {
  console.log("listening on port " + process.env.PORT);
});
DataBaseConnect();
CloudinaryConnect();
