"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.UUID,
        references: {
          model: "Categogies",
          key: "id",
        },
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      receiptId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      originPrice: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      discount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sold_out: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      image: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Products");
  },
};
