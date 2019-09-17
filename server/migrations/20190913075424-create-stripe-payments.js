"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "stripe_payments",
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        description: {
          type: Sequelize.STRING
        },
        card: {
          type: Sequelize.STRING
        },
        invoice_id: {
          type: Sequelize.BIGINT
          // references: {
          //     model: 'invoices',
          //     key: 'id'
          // },
          // onUpdate: 'cascade',
          // onDelete: 'cascade'
        },
        customer_id: {
          type: Sequelize.STRING
        },
        amount: {
          type: "NUMERIC(10, 2)"
        },
        status: {
          type: Sequelize.INTEGER
        },
        email: {
          type: Sequelize.STRING
        },
        session_id: {
          type: Sequelize.STRING
        },
        refund_id: {
          type: Sequelize.STRING
        },
        stripe_connect_id: {
          type: Sequelize.BIGINT
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
    return queryInterface.dropTable('stripe_payments');
  }
};
