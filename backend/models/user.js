"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Order, {
        foreignKey: "userId",
      });
      User.hasMany(models.Cart, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      accessAccount: {
        type: DataTypes.ENUM,
        values: ["CXN", "DXN"],
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["male", "female", "other"],
      },
      referrerId: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM,
        values: ["ADMIN", "STACK", "CUSTOMERS"],
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
