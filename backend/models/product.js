"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.hasMany(models.Cart, {
        foreignKey: "productId",
      });
      Product.hasMany(models.Receipt, {
        foreignKey: "productId",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      categoryId: DataTypes.UUID,
      receiptId: DataTypes.STRING,
      description: DataTypes.TEXT,
      originPrice: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      discount: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      sold_out: DataTypes.INTEGER,
      image: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue("image");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(image) {
          return this.setDataValue("image", JSON.stringify(image));
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
