"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "counselor_bill_settings",
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        business_name: {
          type: Sequelize.STRING
        },
        street: {
          type: Sequelize.STRING
        },
        city: {
          type: Sequelize.STRING
        },
        counselor_id: {
          type: Sequelize.INTEGER
          // references: {
          //   model: "counselors",
          //   key: "id"
          // },
          // onUpdate: "cascade",
          // onDelete: "cascade"
        },
        currency_id: {
          type: Sequelize.INTEGER
          // references: {
          //   model: "currencies",
          //   key: "id"
          // },
          // onUpdate: "cascade",
          // onDelete: "cascade"
        },
        country: {
          type: Sequelize.STRING
        },
        post_code: {
          type: Sequelize.STRING
        },
        state: {
          type: Sequelize.STRING
        },
        apt_unit: {
          type: Sequelize.STRING
        },
        tax: {
          type: Sequelize.REAL
        },
        created_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
        },
        updated_at: {
          type: 'TIMESTAMP',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false
        },
        deleted_at: {
          type: 'TIMESTAMP',
          allowNull: true
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("counselor_bill_settings");
  }
};
