"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoteHistory extends Model {
    static associate(models) {
      NoteHistory.belongsTo(models.Note, {
        foreignKey: "noteID",
        as: "note",
      });
      NoteHistory.belongsTo(models.User, {
        foreignKey: "modifiedBy",
        as: "modifier",
      });
    }
  }
  NoteHistory.init(
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
        references: {
          model: "notes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      checklistItems: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      reminder: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      image: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      action: {
        type: DataTypes.ENUM("created", "updated", "deleted"),
        allowNull: false,
      },
      modifiedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      modifiedAt: {
        type: DataTypes.DATE,
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
      modelName: "NoteHistory",
      tableName: "note_history",
      timestamps: true,
    }
  );
  return NoteHistory;
};
