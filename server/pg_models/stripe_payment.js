'use strict';
module.exports = (sequelize, DataTypes) => {
    const Stripe_Payment = sequelize.define('Stripe_Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        description: {
            type: DataTypes.CHAR
        },
        plan: {
            type: DataTypes.INTEGER
        },
        card: {
            type: DataTypes.CHAR
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
            type: DataTypes.CHAR
        },
        amount: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.CHAR
        },
        chargeId: {
            type: DataTypes.CHAR
        },
        refundId: {
            type: DataTypes.CHAR
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

