const router = require("express").Router();
const CartController = require("../controller/cart.js");
const validateDto = require("../middleware/validate.js");
const { string, stringReq, numberReq } = require("../middleware/Joi.js");
const Joi = require("joi");
const { verifyToken } = require("../middleware/auth.js");

router.post(
  "/create-cart",
  validateDto(
    Joi.object({
      userId: string,
      productId: stringReq,
      quantity: stringReq,
    })
  ),
  verifyToken,
  CartController.createCart
);
router.get("/get-carts", verifyToken, CartController.getCarts);
router.get("/get-cart/:id", verifyToken, CartController.getCart);
router.put("/update-cart/:id", verifyToken, CartController.updateCart);

module.exports = router;
