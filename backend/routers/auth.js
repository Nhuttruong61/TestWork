const router = require("express").Router();
const AuthController = require("../controller/auth");
const validateDto = require("../middleware/validate.js");
const { stringReq, string } = require("../middleware/Joi.js");
const Joi = require("joi");
const { verifyToken } = require("../middleware/auth.js");
router.post(
  "/register",
  validateDto(
    Joi.object({
      fullName: stringReq,
      email: stringReq,
      phone: stringReq,
      password: stringReq,
      gender: stringReq,
      referrerId: string,
    })
  ),
  AuthController.register
);
router.post(
  "/register-stack",
  validateDto(
    Joi.object({
      fullName: stringReq,
      email: stringReq,
      phone: stringReq,
      password: stringReq,
      gender: stringReq,
      referrerId: string,
    })
  ),
  AuthController.registerStack
);
router.post(
  "/login",
  validateDto(
    Joi.object({
      email: stringReq,
      password: stringReq,
    })
  ),
  AuthController.login
);
router.get("/get-user-tk", verifyToken, AuthController.getUserTk);
module.exports = router;
