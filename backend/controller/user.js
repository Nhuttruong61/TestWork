const db = require("../models");

const getUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
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

const getAllUser = async (req, res, next) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ["password"] },
    });
    if (!users) {
      return res.status(401).json({
        mes: "Tài khoản không được tìm thấy",
      });
    }
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};
const getUsersId = async (req, res, next) => {
  try {
    const { id } = req.user;
    const users = await db.User.findAll({
      where: { referrerId: id },
      attributes: ["id", "fullName", "phone"],
    });
    if (!users) {
      return res.status(401).json({
        mes: "Tài khoản không được tìm thấy",
      });
    }
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { fullName, phone, address } = req.body;
    const user = await db.User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(401).json({
        mes: "Tài khoản không được tìm thấy",
      });
    }
    user.fullName = fullName;
    user.phone = phone;
    user.address = address;
    await user.save();
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

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(401).json({
        mes: "Tài khoản không được tìm thấy",
      });
    }
    await db.User.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      mes: "Xóa người dùng thành công",
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const acceptAcount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accessAccount } = req.body;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(401).json({
        mes: "Tài khoản không được tìm thấy",
      });
    }
    user.accessAccount = accessAccount;
    await user.save();
    return res.status(200).json({
      success: true,
      mes: "Xác nhận thành công",
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getRevenueUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const revenue = await db.Order.findAll({
      where: {
        stackId: id,
      },
    });
    return res.status(200).json({
      success: true,
      revenue,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getRevenueUsers = async (req, res, next) => {
  try {
    const { id } = req.user;
    const users = await db.User.findAll({
      where: { referrerId: id },
      attributes: ["id", "fullName", "phone"],
    });
    if (!users) {
      return res.status(401).json({
        mes: "Bạn không quản lý ai",
      });
    }
    const revenuesPromises = users.map(async (item) => {
      const revenue = await db.Order.findAll({
        where: {
          stackId: item.id,
        },
        attributes: ["id", "product", "totalPrice", "createdAt"],
      });
      return {
        user: item,
        revenue,
      };
    });
    const revenues = await Promise.all(revenuesPromises);
    return res.status(200).json({
      success: true,
      revenues,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

module.exports = {
  getUserId,
  getAllUser,
  getUsersId,
  updateUser,
  deleteUser,
  acceptAcount,
  getRevenueUser,
  getRevenueUsers,
};
