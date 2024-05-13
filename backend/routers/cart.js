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
      quantity: numberReq,
    })
  ),
  verifyToken,
  CartController.createCart
);
router.get("/get-carts", verifyToken, CartController.getCarts);
router.delete(
  "/delete-cart/:idc",
  verifyToken,
  CartController.deleteProductCart
);

module.exports = router;
