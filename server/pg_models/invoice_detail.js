'use strict';
module.exports = (sequelize, DataTypes) => {
    const Invoice_Detail = sequelize.define('Invoice_Detail', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        invoice_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        address: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        tax: {
            type: DataTypes.DOUBLE,
            defaultValue: ''
        }
    });
    // Invoice_Detail.associate = ({ Counselor, Currency }) => {
    
    //     Invoice_Detail.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
    //     Invoice_Detail.belongsTo(Counselor, { as: 'currency', foreignKey: 'currency_id', onDelete: 'cascade' });
    // };
    return Invoice_Detail;
};