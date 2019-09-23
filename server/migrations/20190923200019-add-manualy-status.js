'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('new_invoices', 'manualy_sent', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn('new_invoices', 'manualy_paid', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      })
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('new_invoices', 'manualy_sent'),
      queryInterface.removeColumn('new_invoices', 'manualy_paid')
    ]);
  }
};
