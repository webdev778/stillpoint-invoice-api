'use strict';
module.exports = (sequelize, DataTypes) => {
    const Stripe_Payment = sequelize.define('Stripe_Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        description: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        plan: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        card: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        created_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        updated_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        event_order_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        customer_id: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        email: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        charge_id: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        refund_id: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sy_club_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        config_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
    });

    Stripe_Payment.associate = ({ Invoice }) => {
        Stripe_Payment.hasMany(Invoice);
    };

    return Stripe_Payment;
};

