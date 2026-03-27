"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.User, {
        foreignKey: "userID",
        as: "owner",
      });
      Note.hasMany(models.NoteImage, {
        foreignKey: "noteID",
        as: "images",
      });
      Note.hasMany(models.Checklist, {
        foreignKey: "noteID",
        as: "checklists",
      });
      Note.hasMany(models.Reminder, {
        foreignKey: "noteID",
        as: "reminders",
      });
      Note.hasMany(models.NoteHistory, {
        foreignKey: "noteID",
        as: "history",
      });
      Note.hasMany(models.NoteCollaborator, {
        foreignKey: "noteID",
        as: "collaborators",
      });
      Note.hasMany(models.NotePreference, {
        foreignKey: "noteID",
        as: "preferences",
        onDelete: "CASCADE",
      });
      Note.belongsToMany(models.Tag, {
        through: models.NoteTag,
        foreignKey: "noteID",
        otherKey: "tagID",
        as: "tags",
      });
    }
  }
  Note.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
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
      color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#ffffff",
      },
      theme: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
      modelName: "Note",
      tableName: "notes",
      timestamps: true,
      paranoid: true,
    }
  );
  return Note;
};
