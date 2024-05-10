"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categogy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Categogy.hasMany(models.Product, {
        foreignKey: "categoryId",
      });
    }
  }
  Categogy.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING,
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
      modelName: "Categogy",
    }
  );
  return Categogy;
};
