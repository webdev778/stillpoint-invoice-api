"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "stripe_connects",
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
        access_token: {
          type: Sequelize.STRING
        },
        refresh_token: {
          type: Sequelize.STRING
        },
        stripe_publishable_key: {
          type: Sequelize.STRING
        },
        stripe_user_id: {
          type: Sequelize.STRING
        },
        scope: {
          type: Sequelize.STRING
        },
        revoked: {
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
    return queryInterface.dropTable('stripe_connects');
  }
};
