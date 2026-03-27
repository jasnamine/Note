"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoteCollaborator extends Model {
    static associate(models) {
      NoteCollaborator.belongsTo(models.Note, {
        foreignKey: "noteID",
        as: "note",
      });
      NoteCollaborator.belongsTo(models.User, {
        foreignKey: "userID",
        as: "user",
      });
    }
  }
  NoteCollaborator.init(
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
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      permission: {
        type: DataTypes.ENUM("view", "edit"),
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
      modelName: "NoteCollaborator",
      tableName: "note_collaborators",
      timestamps: true,
    }
  );
  return NoteCollaborator;
};
