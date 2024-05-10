"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: DataTypes.UUID,
      stackId: DataTypes.UUID,
      product: {
        type: DataTypes.TEXT,
        get() {
          const rawValue = this.getDataValue("product");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(product) {
          return this.setDataValue("product", JSON.stringify(product));
        },
      },
      totalPrice: DataTypes.INTEGER,
      payment: {
        type: DataTypes.ENUM,
        values: ["Tại quầy", "Online"],
      },
      status: {
        type: DataTypes.ENUM,
        values: ["Chờ xử lý", "Đã hủy", "Đã chuyển hàng", "Đã nhận"],
      },
      paymentStatus: {
        type: DataTypes.ENUM,
        values: ["Chưa thanh toán", "Đẫ thanh toán"],
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
