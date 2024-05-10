const db = require("../models");

const createCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    const checkQuantity = await db.Product.findByPk(productId);
    if (!checkQuantity || checkQuantity.quantity < quantity) {
      return res.status(200).json({
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
const getCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await db.Cart.findByPk(id, {
      include: [
        {
          model: db.Product,
        },
      ],
    });
    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const updateCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await db.Cart.findByPk(id);
    cart.quantity = quantity;
    await cart.save();
    return res.status(200).json({
      success: true,
      cart,
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
  getCart,
  updateCart,
};
