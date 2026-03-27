"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Checklist extends Model {
    static associate(models) {
      Checklist.belongsTo(models.Note, {
        foreignKey: "noteID",
        as: "note",
      });
    }
  }
  Checklist.init(
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
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: "Checklist",
      tableName: "checklists",
      timestamps: true,
    }
  );
  return Checklist;
};
