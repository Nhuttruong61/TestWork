const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token)
    return res.status(401).json({
      mes: "Token không tìm thấy",
    });
  const rawToken = token.split(" ")[1];
  jwt.verify(rawToken, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).json({
        mes: "Token đã hết hạn",
      });
    }
    req.user = decode;
    next();
  });
};
const isStack = (req, res, next) => {
  const { role } = req.user;
  if (role !== "STACK") {
    return res.status(401).json({
      mes: "Bạn không phải là nhân viên",
    });
  }
  next();
};

const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role !== "ADMIN") {
    return res.status(401).json({
      mes: "Bạn không phải admin",
    });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isStack };
