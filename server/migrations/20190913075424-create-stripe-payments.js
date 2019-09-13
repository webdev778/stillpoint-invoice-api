"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "stripe_payments",
      {
        id: {
          type: Sequelize.INTEGER,
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
          type: Sequelize.INTEGER,
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
          type: Sequelize.NUMERIC
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
          type: Sequelize.INTEGER
        }

      },
      {
        engine: "MYISAM", // default: 'InnoDB'
        charset: "latin1", // default: null
        schema: "public" // default: public, PostgreSQL only.
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('stripe_payments');
  }
};
