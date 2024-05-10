const router = require("express").Router();
const CategoryController = require("../controller/category.js");
const validateDto = require("../middleware/validate.js");
const { string, stringReq } = require("../middleware/Joi.js");
const Joi = require("joi");
const { verifyToken, isAdmin, isStack } = require("../middleware/auth.js");

router.post(
  "/create-category",
  validateDto(
    Joi.object({
      name: stringReq,
      image: stringReq,
    })
  ),
  verifyToken,
  isAdmin,
  CategoryController.createCategory
);

router.get("/get-categorys", CategoryController.getCategorys);
router.get("/get-category/:id", CategoryController.getCategory);
router.put(
  "/update-category/:id",
  validateDto(
    Joi.object({
      name: string,
      image: string,
    })
  ),
  verifyToken,
  isAdmin,
  CategoryController.updateCategory
);

router.delete(
  "/delete-category/:id",
  verifyToken,
  isAdmin,
  CategoryController.deleteCategory
);
module.exports = router;
