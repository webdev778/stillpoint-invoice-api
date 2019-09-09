'use strict';

module.exports = (sequelize, DataTypes) => {

    const Invoice = sequelize.define('new_invoice', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        invoice_sn: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        invoice_type: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        invoice_interval: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        subject: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        tax: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        currency_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        sender_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sender_street: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sender_city: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sender_post_code: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sender_country: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_street: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_city: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_post_code: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_country: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        total: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        paid_amount: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        notes: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 'draft'
        },
        issue_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        due_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        viewed_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        sent_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        paid_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        }
    });
    // Invoice.associate = ({ Counselor, Client, Payment, Services }) => {
    //     Invoice.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
    //     Invoice.belongsTo(Client, { as: 'counselor', foreignKey: 'client_id', onDelete: 'cascade' });
    //     Invoice.belongsTo(Stripe_Payment, { as: 'counselor', foreignKey: 'payment_id', onDelete: 'cascade' });
    //     Invoice.hasMany(Services);
    // };

    return Invoice;
};

