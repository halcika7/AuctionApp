const Sequelize = require("sequelize");
const { db } = require("../config/database");

const User = db.define(
  "User",
  {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING(50),
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
        notNull: true
      },
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    },
    lastName: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    },
    photo: {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    gender: {
      type: Sequelize.CHAR(6),
      allowNull: true,
      defaultValue: null
    },
    phoneNumber: {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null
    },
    seller: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    },
    roleId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: "Roles"
        },
        key: "id"
      }
    },
    optionalInfoId: {
      type: Sequelize.BIGINT,
      references: {
        model: {
          tableName: "OptionalInfos"
        },
        key: "id"
      }
    }
  },
  {
    sequelize: Sequelize,
    modelName: "Users"
  }
);

module.exports = User;
