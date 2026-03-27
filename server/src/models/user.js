"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Note, {
        foreignKey: "userID",
        as: "notes",
      });
      User.hasMany(models.Tag, {
        foreignKey: "userID",
        as: "tags",
      });
      User.hasMany(models.NoteCollaborator, {
        foreignKey: "userID",
        as: "collaborations",
      });
      User.hasMany(models.NoteHistory, {
        foreignKey: "modifiedBy",
        as: "history",
      });

      User.hasMany(models.CollaboratorInvitation, {
        foreignKey: "userID",
        as: "receivedInvitations",
        onDelete: "CASCADE",
      });
      User.hasMany(models.CollaboratorInvitation, {
        foreignKey: "inviterID",
        as: "sentInvitations",
        onDelete: "CASCADE",
      });
      User.hasMany(models.Notification, {
        foreignKey: "userID",
        as: "notifications",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      fullname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      settings: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetTokenExpires: {
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
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );
  return User;
};
