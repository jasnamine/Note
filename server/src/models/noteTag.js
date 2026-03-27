"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoteTag extends Model {
    static associate(models) {
      NoteTag.belongsTo(models.Note, {
        foreignKey: "noteID",
        as: "note",
      });
      NoteTag.belongsTo(models.Tag, {
        foreignKey: "tagID",
        as: "tag",
      });
    }
  }
  NoteTag.init(
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
      tagID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "tags", key: "id" },
        onDelete: "CASCADE",
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
      modelName: "NoteTag",
      tableName: "note_tags",
      timestamps: true,
    }
  );
  return NoteTag;
};
