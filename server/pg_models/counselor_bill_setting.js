'use strict';
module.exports = (sequelize, DataTypes) => {
    const Counselor_Bill_Setting = sequelize.define('Counselor_Bill_Setting', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        invoiceName: {
            type: DataTypes.STRING
        },
        street: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        postCode: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        aptUnit: {
            type: DataTypes.STRING
        },
        tax: {
            type: DataTypes.INTEGER
        }
    });
    // Counselor_Bill_Setting.associate = ({ Counselor, Currency }) => {
    
    //     Counselor_Bill_Setting.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
    //     Counselor_Bill_Setting.belongsTo(Currency, { as: 'currency', foreignKey: 'currency_id', onDelete: 'cascade' });
    // };
    return Counselor_Bill_Setting;
};