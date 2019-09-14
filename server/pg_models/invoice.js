"use strict";

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    "Invoice",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      invoiceSn: {
        type: DataTypes.STRING
      },
      invoiceType: {
        type: DataTypes.INTEGER
      },
      clientId: {
        type: DataTypes.INTEGER
      },
      counselorId: {
        type: DataTypes.INTEGER
      },
      sendEvery : {
        type: DataTypes.INTEGER
      },
      subject: {
        type: DataTypes.STRING
      },
      tax: {
        type: DataTypes.REAL
      },
      currencyId: {
        type: DataTypes.INTEGER
      },
      senderName: {
        type: DataTypes.STRING
      },
      senderStreet: {
        type: DataTypes.STRING
      },
      senderCity: {
        type: DataTypes.STRING
      },
      senderPostCode: {
        type: DataTypes.STRING
      },
      senderCountry: {
        type: DataTypes.STRING
      },
      recipientName: {
        type: DataTypes.STRING
      },
      recipientStreet: {
        type: DataTypes.STRING
      },
      recipientCity: {
        type: DataTypes.STRING
      },
      recipientPostCode: {
        type: DataTypes.STRING
      },
      recipientCountry: {
        type: DataTypes.STRING
      },
      total: {
        type: DataTypes.INTEGER
      },
      amount: {
        type: DataTypes.INTEGER
      },

      paidAmount: {
        type: DataTypes.INTEGER
      },
      notes: {
        type: DataTypes.TEXT
      },
      paymentId: {
        type: DataTypes.INTEGER
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: "0"
      },
      issueAt: {
        type: DataTypes.DATE
      },
      dueAt: {
        type: DataTypes.DATE
      },
      viewedAt: {
        type: DataTypes.DATE
      },
      sentAt: {
        type: DataTypes.DATE
      },
      paidAt: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: "new_invoices"
    }
  );
  Invoice.associate = ({ Service, Counselor, Currency }) => {
    Invoice.belongsTo(Counselor, { onDelete: "cascade" });
    // Invoice.belongsTo(Client, { as: 'counselor', foreignKey: 'client_id', onDelete: 'cascade' });
    // Invoice.belongsTo(Stripe_Payment, { as: 'counselor', foreignKey: 'payment_id', onDelete: 'cascade' });
    Invoice.Services = Invoice.hasMany(Service, { as: "services" });
    Invoice.belongsTo(Currency);
  };

  return Invoice;
};
