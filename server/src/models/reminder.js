"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reminder extends Model {
    static associate(models) {
      Reminder.belongsTo(models.Note, {
        foreignKey: "noteID",
        as: "note",
      });
    }
  }
  Reminder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      noteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "notes", key: "id" },
        onDelete: "CASCADE",
      },
      time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      repeat: {
        type: DataTypes.ENUM("none", "daily", "weekly", "monthly"),
        defaultValue: "none",
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Reminder",
      tableName: "reminders",
      timestamps: true,
    }
  );
  return Reminder;
};
