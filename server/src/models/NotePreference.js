"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NotePreference extends Model {
    static associate(models) {
      NotePreference.belongsTo(models.Note, {
        foreignKey: "noteID",
        as: "note",
        onDelete: "CASCADE",
      });

      NotePreference.belongsTo(models.User, {
        foreignKey: "userID",
        as: "user",
        onDelete: "CASCADE",
      });

      NotePreference.hasMany(models.Reminder, {
        foreignKey: "noteID",
        as: "reminders",
      });
    }
  }

  NotePreference.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      noteID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isPinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      pinnedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "NotePreference",
      tableName: "NotePreferences",
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      indexes: [
        {
          unique: true,
          fields: ["noteID", "userID"], // 1 user chỉ có 1 preference cho 1 note
        },
      ],
    }
  );

  return NotePreference;
};
