'use strict';

module.exports = (sequelize, DataTypes) => {

    const Invoice = sequelize.define('Invoice', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
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
        invoiceInterval: {
            type: DataTypes.INTEGER
        },
        subject: {
            type: DataTypes.STRING
        },
        tax: {
            type: DataTypes.INTEGER
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
            defaultValue: '0'
        },
        issueAt: {
            type: DataTypes.TIME
        },
        dueAt: {
            type: DataTypes.TIME
        },
        viewedAt: {
            type: DataTypes.TIME
        },
        sentAt: {
            type: DataTypes.TIME
        },
        paidAt: {
            type: DataTypes.TIME
        }
    }, {
        tableName: "new_invoices"
    });
    Invoice.associate = ({ Service/*, Client, Stripe_Payment*/ }) => {
        // Invoice.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
        // Invoice.belongsTo(Client, { as: 'counselor', foreignKey: 'client_id', onDelete: 'cascade' });
        // Invoice.belongsTo(Stripe_Payment, { as: 'counselor', foreignKey: 'payment_id', onDelete: 'cascade' });
        Invoice.Services = Invoice.hasMany(Service, { as: 'services'});
    };

    return Invoice;
};

