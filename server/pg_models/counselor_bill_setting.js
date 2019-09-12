'use strict';
module.exports = (sequelize, DataTypes) => {
    const CounselorBillSetting = sequelize.define('CounselorBillSetting', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        businessName: {
            type: DataTypes.STRING
        },
        street: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        counselorId: {
            type: DataTypes.INTEGER
        },
        currencyId: {
            type: DataTypes.INTEGER
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
            type: DataTypes.REAL
        }
    }
    ,{
        tableName: 'counselor_bill_settings'
    }
    );
    CounselorBillSetting.associate = ({ Counselor, Currency }) => {
    
        CounselorBillSetting.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselorId', onDelete: 'cascade' });
        CounselorBillSetting.belongsTo(Currency, { as: 'currency', foreignKey: 'currencyId', onDelete: 'cascade' });
    };
    return CounselorBillSetting;
};