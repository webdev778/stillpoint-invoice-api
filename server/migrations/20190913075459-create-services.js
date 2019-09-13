"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "services",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        //foreign key usage
        invoice_id: {
            type: Sequelize.INTEGER,
            // references: {
            //     model: 'new_invoices',
            //     key: 'id'
            // },
            // onUpdate: 'cascade',
            // onDelete: 'cascade'
        },
        service_type_id: {
          type: Sequelize.INTEGER
          // references: {
          //     model: 'service_types',
          //     key: 'id'
          // },
          // onUpdate: 'cascade',
          // onDelete: 'cascade'
        },
        name: {
          type: Sequelize.STRING
        },
        description: {
          type: Sequelize.TEXT
        },
        quantity: {
          type: Sequelize.INTEGER
        },
        unit_price: {
          type: "NUMERIC(10, 2)"
        },
        tax_charge: {
          type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('services');
  }
};
