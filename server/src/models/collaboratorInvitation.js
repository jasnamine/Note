"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CollaboratorInvitation extends Model {
    static associate(models) {
      CollaboratorInvitation.belongsTo(models.Note, {
        foreignKey: "noteID",
        as: "note",
        onDelete: "CASCADE",
      });
      CollaboratorInvitation.belongsTo(models.User, {
        foreignKey: "userID",
        as: "invitee",
        onDelete: "CASCADE",
      });
      CollaboratorInvitation.belongsTo(models.User, {
        foreignKey: "inviterID",
        as: "inviter",
        onDelete: "CASCADE",
      });
    }
  }
  CollaboratorInvitation.init(
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
      inviterID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      permission: {
        type: DataTypes.ENUM("view", "edit"),
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "expired"),
        allowNull: false,
        defaultValue: "pending",
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
      modelName: "CollaboratorInvitation",
      tableName: "collaboratorInvitations",
      timestamps: true,
      paranoid: false,
    },
  );
  return CollaboratorInvitation;
};
