const db = require("../models");
const { Sequelize, where } = require("sequelize");
const createProduct = async (req, res, next) => {
  try {
    const { name, categoryId, description, image } = req.body;
    const checkName = await db.Product.findOne({ where: { name: name } });
    if (checkName) {
      return res.status(400).json({
        mes: "Tên sản phẩm đã tồn tại",
      });
    }
    const product = await db.Product.create({
      name: name,
      categoryId: categoryId,
      description: description,
      image: image,
    });
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      receiptId,
      originPrice,
      price,
      discount,
      quantity,
      image,
    } = req.body;
    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(400).json({
        mes: "Không tìm thấy sản phẩm",
      });
    }
    product.name = name;
    product.description = description;
    product.receiptId = receiptId;
    product.originPrice = originPrice;
    product.price = price;
    product.discount = discount;
    product.quantity = quantity;
    product.image = image;
    await product.save();
    return res.status(200).json({
      success: true,
      mes: "Cập nhật thành công",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { name } = req.query;
    if (name) {
      const product = await db.Product.findAll({
        where: Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("name")),
          "LIKE",
          `%${name.toLowerCase()}%`
        ),
      });

      return res.status(200).json({
        success: true,
        product,
      });
    }
    const product = await db.Product.findAll({
      include: [
        {
          model: db.Categogy,
          attributes: ["id", "name"],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await db.Product.findByPk(id, {
      include: [
        {
          model: db.Categogy,
          attributes: ["id", "name"],
        },
      ],
    });
    if (!product) {
      return res.status(400).json({
        mes: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await db.Product.findByPk(id);
    if (!product) {
      return res.status(400).json({
        mes: "Không tìm thấy sản phẩm",
      });
    }
    await db.Product.destroy({
      where: {
        id,
      },
    });
    return res.status(200).json({
      success: true,
      mes: "Xóa sản phẩm thành công",
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};
module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProduct,
  deleteProduct,
};
