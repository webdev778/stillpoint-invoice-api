'use strict';
module.exports = (sequelize, DataTypes) => {
    const Invoice_Detail = sequelize.define('Invoice_Detail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        invoiceName: {
            type: DataTypes.CHAR
        },
        address: {
            type: DataTypes.CHAR
        },
        tax: {
            type: DataTypes.DOUBLE
        }
    });
    // Invoice_Detail.associate = ({ Counselor, Currency }) => {
    
    //     Invoice_Detail.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
    //     Invoice_Detail.belongsTo(Counselor, { as: 'currency', foreignKey: 'currency_id', onDelete: 'cascade' });
    // };
    return Invoice_Detail;
};