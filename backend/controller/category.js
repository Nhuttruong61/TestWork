const db = require("../models");
const cloudinary = require("cloudinary").v2;
const createCategory = async (req, res, next) => {
  try {
    const { name, image } = req.body;
    const checkName = await db.Categogy.findOne({ where: { name: name } });

    if (checkName) {
      return res.status(400).json({
        mes: "Tên danh mục dẫ tồn tại",
      });
    }
    const myCloud = await cloudinary.uploader.upload(image, {
      folder: "testWork/Category",
    });
    const category = await db.Categogy.create({
      name: name,
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
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
    if (image) {
      const myCloud = await cloudinary.uploader.upload(image, {
        folder: "testWork/Category",
      });
      category.image = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    category.name = name;
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
    await cloudinary.uploader.destroy(category.image.public_id);
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
