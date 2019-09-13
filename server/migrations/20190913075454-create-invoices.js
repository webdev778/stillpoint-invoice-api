"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "new_invoices",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        invoice_sn: {
          type: Sequelize.STRING
        },
        invoice_type: {
          type: Sequelize.INTEGER
        },
        client_id: {
          type: Sequelize.INTEGER,
          // references: {
          //     model: 'users',
          //     key: 'id'
          // },
          // onUpdate: 'cascade',
          // onDelete: 'cascade'
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
        invoice_interval: {
          type: Sequelize.INTEGER
        },
        subject: {
          type: Sequelize.STRING
        },
        tax: {
          type: Sequelize.REAL
        },
        currency_id: {
          type: Sequelize.INTEGER
        },
        sender_name: {
          type: Sequelize.STRING
        },
        sender_street: {
          type: Sequelize.STRING
        },
        sender_city: {
          type: Sequelize.STRING
        },
        sender_post_code: {
          type: Sequelize.STRING
        },
        sender_country: {
          type: Sequelize.STRING
        },
        recipient_name: {
          type: Sequelize.STRING
        },
        recipient_street: {
          type: Sequelize.STRING
        },
        recipient_city: {
          type: Sequelize.STRING
        },
        recipient_post_code: {
          type: Sequelize.STRING
        },
        recipient_country: {
          type: Sequelize.STRING
        },
        total: {
          type: Sequelize.NUMERIC
        },
        amount: {
          type: Sequelize.NUMERIC
        },
        paid_amount: {
          type: Sequelize.NUMERIC
        },
        notes: {
          type: Sequelize.TEXT
        },
        status: {
          type: Sequelize.INTEGER,
          defaultValue: "0"
        },
        issue_at: {
          type: Sequelize.DATE
        },
        due_at: {
          type: Sequelize.DATE
        },
        viewed_at: {
          type: Sequelize.DATE
        },
        sent_at: {
          type: Sequelize.DATE
        },
        paid_at: {
          type: Sequelize.DATE
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
    return queryInterface.dropTable('new_invoices');
  }
};
