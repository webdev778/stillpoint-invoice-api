"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "service_types",
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        counselor_id: {
          type: Sequelize.INTEGER
          // references: {
          //     model: 'counselors',
          //     key: 'id'
          // },
          // onUpdate: 'cascade',
          // onDelete: 'cascade'
        },
        name: {
          type: Sequelize.STRING
        },
        type: {
          type: Sequelize.INTEGER
        },
        price: {
          type: "NUMERIC(10, 2)"
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
    return queryInterface.dropTable('service_types');
  }
};
