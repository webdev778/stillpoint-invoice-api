"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "service_types",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        counselor_id: {
          type: Sequelize.INTEGER,
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
          type: Sequelize.NUMERIC
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
    return queryInterface.dropTable('service_types');
  }
};
