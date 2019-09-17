"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "services",
      {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        //foreign key usage
        invoice_id: {
            type: Sequelize.BIGINT
            // references: {
            //     model: 'new_invoices',
            //     key: 'id'
            // },
            // onUpdate: 'cascade',
            // onDelete: 'cascade'
        },
        service_type_id: {
          type: Sequelize.BIGINT
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
    return queryInterface.dropTable('services');
  }
};
