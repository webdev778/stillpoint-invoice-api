'use strict';
module.exports = (sequelize, DataTypes) => {
    const StripePayment = sequelize.define('StripePayment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING
        },
        card: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        invoiceId: {
            type: DataTypes.INTEGER
        },
        customerId: {
            type: DataTypes.STRING
        },
        amount: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING
        },
        sessionId: {
            type: DataTypes.STRING
        },
        refundId: {
            type: DataTypes.STRING
        },
        stripeConnectId: {
            type: DataTypes.INTEGER
        },
    });

    // Stripe_Payment.associate = ({ Invoice }) => {
    //     Stripe_Payment.hasMany(Invoice);
    // };

    return StripePayment;
};

