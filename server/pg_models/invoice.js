'use strict';

module.exports = (sequelize, DataTypes) => {

    const Invoice = sequelize.define('Invoice', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        invoiceSn: {
            type: DataTypes.CHAR
        },
        invoiceType: {
            type: DataTypes.INTEGER
        },
        invoiceInterval: {
            type: DataTypes.INTEGER
        },
        subject: {
            type: DataTypes.CHAR
        },
        tax: {
            type: DataTypes.INTEGER
        },
        currencyId: {
            type: DataTypes.INTEGER
        },
        senderName: {
            type: DataTypes.CHAR
        },
        senderStreet: {
            type: DataTypes.CHAR
        },
        senderCity: {
            type: DataTypes.CHAR
        },
        senderPostCode: {
            type: DataTypes.CHAR
        },
        senderCountry: {
            type: DataTypes.CHAR
        },
        recipientName: {
            type: DataTypes.CHAR
        },
        recipientStreet: {
            type: DataTypes.CHAR
        },
        recipientCity: {
            type: DataTypes.CHAR
        },
        recipientPostCode: {
            type: DataTypes.CHAR
        },
        recipientCountry: {
            type: DataTypes.CHAR
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
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 'draft'
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
    }, {
        tableName: "new_invoices"
    });
    Invoice.associate = ({ Service }) => {
        // Invoice.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
        // Invoice.belongsTo(Client, { as: 'counselor', foreignKey: 'client_id', onDelete: 'cascade' });
        // Invoice.belongsTo(Stripe_Payment, { as: 'counselor', foreignKey: 'payment_id', onDelete: 'cascade' });
        Invoice.hasMany(Service);
    };

    return Invoice;
};

