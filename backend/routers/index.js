const Auth = require("./auth");
const User = require("./user");
const Category = require("./category");
const Product = require("./product");
const Receipt = require("./receipt");
const Order = require("./order");
const Cart = require("./cart");

const initialRouter = (app) => {
  app.use("/api/v1/auth", Auth);
  app.use("/api/v1/user", User);
  app.use("/api/v1/category", Category);
  app.use("/api/v1/product", Product);
  app.use("/api/v1/receipt", Receipt);
  app.use("/api/v1/order", Order);
  app.use("/api/v1/cart", Cart);

  app.use("/", (req, res) => {
    return res.send("Server on");
  });
};

module.exports = initialRouter;
