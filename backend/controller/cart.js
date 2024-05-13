const db = require("../models");

const createCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    const checkQuantity = await db.Product.findByPk(productId);
    if (!checkQuantity || checkQuantity.quantity < quantity) {
      return res.status(400).json({
        success: false,
        mes: "Số lượng trong kho không đủ",
      });
    }
    let cart = await db.Cart.findOne({
      where: {
        userId: userId,
        productId: productId,
      },
    });
    if (!cart) {
      cart = await db.Cart.create({
        userId: userId,
        productId: productId,
        quantity: quantity,
      });
      return res.status(200).json({
        success: true,
        cart,
      });
    }

    const updatedCart = await cart.update({
      quantity: quantity,
    });

    return res.status(200).json({
      success: true,
      cart: updatedCart,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getCarts = async (req, res, next) => {
  try {
    const { id } = req.user;
    const carts = await db.Cart.findAll({
      where: {
        userId: id,
      },
      include: [
        {
          model: db.Product,
        },
        {
          model: db.User,
          attributes: ["fullName", "phone", "address"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      carts,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const deleteProductCart = async (req, res, next) => {
  try {
    const { idc } = req.params;
    const cart = await db.Cart.findByPk(idc);
    if (!cart) {
      return res.status(400).json({
        success: false,
        mes: "Không tìm thấy sản phẩm",
      });
    }
    await db.Cart.destroy({
      where: {
        id: idc,
      },
    });

    return res.status(200).json({
      success: true,
      mes: "Xóa thành công",
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

module.exports = {
  createCart,
  getCarts,
  deleteProductCart,
};
