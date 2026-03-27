"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ReminderUserStatus extends Model {
    static associate(models) {
      ReminderUserStatus.belongsTo(models.Reminder, {
        foreignKey: "reminderID",
        as: "reminder",
        onDelete: "CASCADE",
      });
      ReminderUserStatus.belongsTo(models.User, {
        foreignKey: "userID",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }

  ReminderUserStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      reminderID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "reminders", key: "id" },
        onDelete: "CASCADE",
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      lastNotified: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "sent", "skipped"),
        allowNull: false,
        defaultValue: "pending",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "ReminderUserStatus",
      tableName: "reminder_user_status",
      timestamps: true,
    }
  );

  return ReminderUserStatus;
};
