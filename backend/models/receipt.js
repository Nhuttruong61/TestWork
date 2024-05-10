"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Receipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Receipt.belongsTo(models.Product, {
        foreignKey: "productId",
      });
    }
  }
  Receipt.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      productId: DataTypes.UUID,
      originPrice: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      sold_out: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Receipt",
    }
  );
  return Receipt;
};
