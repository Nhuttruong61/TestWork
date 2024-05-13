const db = require("../models");

const createOrder = async (req, res, next) => {
  try {
    const { stackId, product, totalPrice, payment, status, paymentStatus } =
      req.body;
    if (payment === "Tại quầy") {
      const idCart = [];
      for (el of product) {
        const product = await db.Product.findByPk(el.product);
        if (!product) {
          return res.status(400).json({
            success: false,
            mes: "Sản phẩm không tồn tại",
          });
        }
        const receipt = await db.Receipt.findByPk(product.receiptId);
        const cart = await db.Cart.create({
          productId: el.product,
          quantity: el.quantity,
        });
        idCart.push({
          product: cart.productId,
          quantity: cart.quantity,
        });
        await product.update({
          quantity: product.quantity - el.quantity,
          sold_out: product.sold_out + el.quantity,
        });
        await receipt.update({
          quantity: receipt.quantity - el.quantity,
          sold_out: receipt.sold_out + el.quantity,
        });
        await db.Cart.destroy({
          where: {
            id: cart.id,
          },
        });
      }
      const order = await db.Order.create({
        stackId: stackId,
        product: idCart,
        totalPrice: totalPrice,
        payment: payment,
        status: status,
        paymentStatus: paymentStatus,
      });
      return res.status(200).json({
        success: true,
        order,
      });
    }
    const { id } = req.user;
    const listProduct = await db.Cart.findAll({
      where: {
        userId: id,
      },
      attributes: ["id", "userId", "productId", "quantity"],
    });
    if (listProduct.length <= 0) {
      return res.status(200).json({
        success: false,
        mes: "Tạm thời không có sản phẩm",
      });
    }
    const order = await db.Order.create({
      userId: id,
      product: listProduct,
      totalPrice: totalPrice,
      payment: payment,
      status: status,
      paymentStatus: paymentStatus,
    });
    for (el of listProduct) {
      await db.Cart.destroy({
        where: {
          id: el.id,
        },
      });
    }
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};
const getOrderOnlines = async (req, res, next) => {
  try {
    const orders = await db.Order.findAll({
      where: {
        payment: "Online",
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "fullName", "phone", "address"],
        },
      ],
    });
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.product.map(async (item) => {
            const product = await db.Product.findByPk(item.productId);
            return {
              id: product.id,
              name: product.name,
              quantity: item.quantity,
            };
          })
        );
        order.product = products;
        return order;
      })
    );
    console.log(formattedOrders);
    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        {
          model: db.User,
          attributes: ["id", "fullName", "phone", "address"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await db.Order.findAll(id);
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.product.map(async (item) => {
            const product = await db.Product.findByPk(item.productId);
            return {
              id: product.id,
              name: product.name,
              quantity: item.quantity,
            };
          })
        );
        order.product = products;
        return order;
      })
    );
    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(200).json({
        success: false,
        mes: "Không tìm thấy đơn hàng",
      });
    }

    if (order.status === "Chờ xử lý" && status !== "Đã hủy") {
      for (el of order.product) {
        const product = await db.Product.findByPk(el.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            mes: "Sản phẩm không tồn tại",
          });
        }
        const receipt = await db.Receipt.findByPk(product.receiptId);
        await product.update({
          quantity: product.quantity - el.quantity,
          sold_out: product.sold_out + el.quantity,
        });
        await receipt.update({
          quantity: receipt.quantity - el.quantity,
          sold_out: receipt.sold_out + el.quantity,
        });
      }
    }
    if (status === "Đã nhận") {
      order.paymentStatus = "Đã thanh toán";
    }
    order.status = status;
    await order.save();
    return res.status(200).json({
      success: true,
      mes: "cập nhật trạng thái thành công",
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const cancleOrder = async (req, res, next) => {
  try {
    const { id } = req.user;
    const order = await db.Order.findByPk(req.params.id);
    if (!order) {
      return res.status(200).json({
        success: false,
        mes: "Không tìm thấy đơn hàng",
      });
    }
    if (id === order.userId || order.status === "Chờ xử lý") {
      order.status = "Đã hủy";
      await order.save();
      return res.status(200).json({
        success: true,
        mes: "Hủy đơn thành công",
      });
    }
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(200).json({
        success: false,
        mes: "Không tìm thấy đơn hàng",
      });
    }
    await db.Order.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      mes: "Xóa đơn hàng thành công",
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getOrderUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const orders = await db.Order.findAll({
      where: {
        userId: id,
      },
    });
    const formattedOrders = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.product.map(async (item) => {
            const product = await db.Product.findByPk(item.productId);
            return {
              id: product.id,
              name: product.name,
              image: product.image,
              quantity: item.quantity,
            };
          })
        );
        order.product = products;
        return order;
      })
    );
    return res.status(200).json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

module.exports = {
  createOrder,
  getOrderOnlines,
  getOrder,
  getOrderUser,
  updateStatus,
  cancleOrder,
  deleteOrder,
  getOrders,
};
