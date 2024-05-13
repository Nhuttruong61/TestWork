const router = require("express").Router();
const Joi = require("joi");
const OrderController = require("../controller/order.js");
const validateDto = require("../middleware/validate.js");
const { string, stringReq, numberReq, array } = require("../middleware/Joi.js");
const { verifyToken, isAdmin, isStack } = require("../middleware/auth.js");

router.post(
  "/create-order",
  validateDto(
    Joi.object({
      stackId: string,
      product: array,
      totalPrice: numberReq,
      payment: stringReq,
      status: stringReq,
      paymentStatus: stringReq,
    })
  ),
  verifyToken,
  OrderController.createOrder
);

router.get(
  "/get-orders-online",
  verifyToken,
  isAdmin,
  OrderController.getOrderOnlines
);
router.get("/get-orders", verifyToken, isAdmin, OrderController.getOrders);
router.get("/get-order/:id", verifyToken, OrderController.getOrder);
router.get("/get-order-user", verifyToken, OrderController.getOrderUser);

router.put(
  "/update-status/:id",
  validateDto(
    Joi.object({
      status: stringReq,
    })
  ),
  verifyToken,
  isAdmin,
  OrderController.updateStatus
);
router.put("/cancle-order/:id", verifyToken, OrderController.cancleOrder);
router.delete(
  "/delete-order/:id",
  verifyToken,
  isAdmin,
  OrderController.deleteOrder
);

module.exports = router;
