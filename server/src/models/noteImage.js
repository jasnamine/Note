"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoteImage extends Model {
    static associate(models) {
      NoteImage.belongsTo(models.Note, {
        foreignKey: "noteID",
        as: "note",
      });
    }
  }
  NoteImage.init(
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
      url: {
        type: DataTypes.STRING,
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
      modelName: "NoteImage",
      tableName: "note_images",
      timestamps: true,
    }
  );
  return NoteImage;
};
