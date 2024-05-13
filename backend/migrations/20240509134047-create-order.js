"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      stackId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
      product: {
        type: Sequelize.TEXT,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
      },
      payment: {
        type: Sequelize.ENUM,
        values: ["Tại quầy", "Online"],
      },
      status: {
        type: Sequelize.ENUM,
        values: ["Chờ xử lý", "Đã hủy", "Đã chuyển hàng", "Đã nhận"],
        defaultValue: "Chờ xử lý",
      },
      paymentStatus: {
        type: Sequelize.ENUM,
        values: ["Chưa thanh toán", "Đã thanh toán"],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
