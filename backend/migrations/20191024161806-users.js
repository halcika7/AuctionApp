'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
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
        allowNull: false,
        defaultValue: null
      },
      gender: {
        type: Sequelize.STRING(6),
        allowNull: false,
        defaultValue: 'Other'
      },
      phoneNumber: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: ''
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Date.now()
      },
      deactivated: {
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
            tableName: 'Roles'
          },
          key: 'id'
        }
      },
      optionalInfoId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'OptionalInfos'
          },
          key: 'id'
        }
      },
      cardInfoId: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'CardInfos'
          },
          key: 'id'
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
