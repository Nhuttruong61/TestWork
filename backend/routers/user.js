const router = require("express").Router();
const UserController = require("../controller/user.js");
const validateDto = require("../middleware/validate.js");
const { string } = require("../middleware/Joi.js");
const Joi = require("joi");
const { verifyToken, isAdmin, isStack } = require("../middleware/auth.js");

router.get("/get-all-user", verifyToken, isAdmin, UserController.getAllUser);
router.get("/get-user/:id", verifyToken, UserController.getUserId);
router.get("/get-users-id", verifyToken, isStack, UserController.getUsersId);
router.put(
  "/update",
  validateDto(
    Joi.object({
      fullName: string,
      phone: string,
      address: string,
    })
  ),
  verifyToken,
  UserController.updateUser
);
router.delete("/delete/:id", verifyToken, isAdmin, UserController.deleteUser);
router.put("/accept/:id", verifyToken, isAdmin, UserController.acceptAcount);
router.get(
  "/get-revenue",
  verifyToken,
  isStack,
  UserController.getRevenueUsers
);
router.get(
  "/get-revenues",
  verifyToken,
  isStack,
  UserController.getRevenueUsers
);

module.exports = router;
