const { where } = require("sequelize");
const db = require("../models");

const createReceipt = async (req, res, next) => {
  try {
    const { productId, originPrice, quantity } = req.body;
    const receipt = await db.Receipt.create({
      productId: productId,
      originPrice: originPrice,
      quantity: quantity,
    });
    return res.status(200).json({
      success: true,
      receipt,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getReceipts = async (req, res, next) => {
  try {
    const receipt = await await db.Receipt.findAll({
      include: [
        {
          model: db.Product,
          attributes: ["id", "name", "image"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      receipt,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};
const getReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const receipt = await await db.Receipt.findByPk(id, {
      include: [
        {
          model: db.Product,
          attributes: ["id", "name", "image"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      receipt,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const deleteReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const receipt = await await db.Receipt.findByPk(id);
    if (!receipt) {
      return res.status(400).json({
        mes: "Phiếu nhập không tồn tại",
      });
    }
    await db.Receipt.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      mes: "Xóa phiếu nhập thành công!",
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

module.exports = {
  createReceipt,
  getReceipts,
  deleteReceipt,
  getReceipt,
};
