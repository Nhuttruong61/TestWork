const router = require("express").Router();

const ReceiptController = require("../controller/receipt");
const validateDto = require("../middleware/validate.js");
const { string, stringReq, numberReq } = require("../middleware/Joi.js");
const Joi = require("joi");
const { verifyToken, isAdmin, isStack } = require("../middleware/auth.js");

router.post(
  "/create-receipt",
  validateDto(
    Joi.object({
      productId: stringReq,
      originPrice: numberReq,
      quantity: numberReq,
    })
  ),
  verifyToken,
  isAdmin,
  ReceiptController.createReceipt
);

router.get(
  "/get-receipts",
  verifyToken,
  isAdmin,
  ReceiptController.getReceipts
);
module.exports = router;
