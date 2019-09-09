'use strict';
module.exports = (sequelize, DataTypes) => {
    const Currency = sequelize.define('Currency', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
       
        code: {
            type: DataTypes.CHAR
        }
    });

    // Currency.associate = ({ Invoice_Detail }) => {
    //     Currency.hasMany(Invoice_Detail);
    
    // };

    return Currency;
};

