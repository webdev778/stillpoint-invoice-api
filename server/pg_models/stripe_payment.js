'use strict';
module.exports = (sequelize, DataTypes) => {
    const Stripe_Payment = sequelize.define('Stripe_Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING
        },
        plan: {
            type: DataTypes.INTEGER
        },
        card: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.TIME
        },
        updatedAt: {
            type: DataTypes.TIME
        },
        eventOrderId: {
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
        chargeId: {
            type: DataTypes.STRING
        },
        refundId: {
            type: DataTypes.STRING
        },
        syClubId: {
            type: DataTypes.INTEGER
        },
        configId: {
            type: DataTypes.INTEGER
        },
    });

    // Stripe_Payment.associate = ({ Invoice }) => {
    //     Stripe_Payment.hasMany(Invoice);
    // };

    return Stripe_Payment;
};

