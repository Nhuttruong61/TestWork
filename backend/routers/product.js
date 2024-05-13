const router = require("express").Router();

const ProductController = require("../controller/product.js");
const validateDto = require("../middleware/validate.js");
const { stringReq, number, string } = require("../middleware/Joi.js");
const Joi = require("joi");
const { verifyToken, isAdmin, isStack } = require("../middleware/auth.js");

router.post(
  "/create-product",
  validateDto(
    Joi.object({
      name: stringReq,
      categoryId: stringReq,
      description: stringReq,
      image: stringReq,
    })
  ),
  verifyToken,
  isAdmin,
  ProductController.createProduct
);

router.put(
  "/update-product/:id",
  validateDto(
    Joi.object({
      name: string,
      description: string,
      receiptId: string,
      originPrice: number,
      price: number,
      discount: number,
      quantity: number,
      image: string,
    })
  ),
  verifyToken,
  isAdmin,
  ProductController.updateProduct
);

router.get("/get-products", ProductController.getProducts);
router.get("/get-product/:id", ProductController.getProduct);
router.get("/get-product-category/:id", ProductController.getProductCategory);

router.delete(
  "/delete-product/:id",
  verifyToken,
  isAdmin,
  ProductController.deleteProduct
);

module.exports = router;
