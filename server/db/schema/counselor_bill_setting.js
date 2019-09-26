"use strict";
module.exports = (sequelize, DataTypes) => {
  const CounselorBillSetting = sequelize.define(
    "CounselorBillSetting",
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
      },
      address: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: "counselor_bill_settings"
    }
  );
  CounselorBillSetting.associate = ({ Counselor, Currency }) => {
    CounselorBillSetting.belongsTo(Counselor);
    CounselorBillSetting.belongsTo(Currency);
  };
  return CounselorBillSetting;
};
