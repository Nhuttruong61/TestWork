const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
    const { phone, email, password, fullName, gender, referrerId } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const checkmail = reg.test(email);
    if (!checkmail)
      return res.status(403).json({
        success: false,
        mes: "Định dạng email không hợp lệ",
      });
    const check = await db.User.findOne({
      where: { phone: phone },
    });
    if (check) {
      return res.status(400).json({
        success: false,
        mes: "Số điện thoại đã được sử dụng",
      });
    }
    const checkEmail = await db.User.findOne({ where: { email: email } });
    if (checkEmail) {
      return res.status(400).json({
        success: false,
        mes: "Email đã được sử dụng",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      fullName: fullName,
      email: email,
      phone: phone,
      password: hashedPassword,
      gender: gender,
      referrerId: referrerId,
    });
    if (user) {
      return res.status(200).json({
        success: true,
        mes: "Đăng kí thành công",
      });
    }
  } catch (err) {
    return res.status(500).json({
      mes: err.mes,
    });
  }
};

const registerStack = async (req, res) => {
  try {
    const { phone, email, password, fullName, gender, referrerId } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const checkmail = reg.test(email);
    if (!checkmail)
      return res.status(403).json({
        success: false,
        mes: "Định dạng email không hợp lệ",
      });
    const check = await db.User.findOne({
      where: { phone: phone },
    });
    if (check && check.accessAccount === "CXN") {
      return res.status(400).json({
        success: false,
        mes: "Vui lòng chờ admin xác nhận",
      });
    }
    if (check) {
      return res.status(400).json({
        success: false,
        mes: "Số điện thoại đã được sử dụng",
      });
    }

    const checkEmail = await db.User.findOne({ where: { email: email } });

    if (checkEmail) {
      return res.status(400).json({
        success: false,
        mes: "Email đã được sử dụng",
      });
    }
    const checkUser = await db.User.findByPk(referrerId);
    if (!checkUser || checkUser.role === "USER") {
      return res.status(400).json({
        success: false,
        mes: "Mã giới thiệu không chính xác",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      fullName: fullName,
      email: email,
      phone: phone,
      password: hashedPassword,
      role: "STACK",
      accessAccount: "CXN",
      gender: gender,
      referrerId: referrerId,
    });
    if (user) {
      return res.status(200).json({
        success: true,
        mes: "Đã đăng kí vui lòng chờ admin xác nhận",
      });
    }
  } catch (err) {
    return res.status(500).json({
      mes: err.mes,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(401).json({
        mes: "Tài khoản không được tìm thấy",
      });
    }
    if (user.accessAccount !== "DXN") {
      return res.status(401).json({
        mes: "Tài khoản của bạn chưa được chấp nhận",
      });
    }
    const isMatchingPassword = bcrypt.compareSync(password, user.password);
    if (!isMatchingPassword) {
      return throwError(404, "Password does not match", res, next);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err.mes,
    });
  }
};

const getUserTk = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await db.User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(401).json({
        mes: "Tài khoản không được tìm thấy",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

module.exports = {
  register,
  login,
  getUserTk,
  registerStack,
};
