"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsTo(models.User, {
        foreignKey: "userID",
        as: "owner",
      });
      Tag.belongsToMany(models.Note, {
        through: models.NoteTag,
        foreignKey: "tagID",
        otherKey: "noteID",
        as: "notes",
      });
      Tag.belongsTo(models.NoteTag, {
        foreignKey: "id",
        as: "tags",
      });
    }
  }
  Tag.init(
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
      name: {
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
      modelName: "Tag",
      tableName: "tags",
      timestamps: true,
    }
  );
  return Tag;
};
