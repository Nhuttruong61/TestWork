const db = require("../models");

const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const checkName = await db.Categogy.findOne({ where: { name: name } });

    if (checkName) {
      return res.status(400).json({
        mes: "Tên danh mục dẫ tồn tại",
      });
    }
    const category = await db.Categogy.create({
      name: name,
      image: image,
    });
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getCategorys = async (req, res, next) => {
  try {
    const category = await db.Categogy.findAll();
    if (!category) {
      return res.status(400).json({
        mes: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await db.Categogy.findByPk(id);
    if (!category) {
      return res.status(400).json({
        mes: "Không tìm thấy sản phẩm",
      });
    }
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const category = await db.Categogy.findByPk(id);
    if (!category) {
      return res.status(400).json({
        mes: "Không tìm thấy sản phẩm",
      });
    }
    category.name = name;
    category.image = image;
    await category.save();

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    return res.status(500).json({
      mes: err,
    });
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await db.Categogy.findByPk(id);
    if (!category) {
      return res.status(400).json({
        mes: "Không tìm thấy sản phẩm",
      });
    }
    await db.Categogy.destroy({
      where: {
        id,
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
  createCategory,
  getCategorys,
  getCategory,
  updateCategory,
  deleteCategory,
};
