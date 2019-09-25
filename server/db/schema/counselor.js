"use strict";

module.exports = (sequelize, DataTypes) => {
  const Counselor = sequelize.define("Counselor", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER
    }
  });
  Counselor.associate = ({
    Invoice,
    Service_Type,
    CounselorBillSetting,
    User,
    StripeConnect,
    ContactAddress
  }) => {
    // Counselor.hasMany(Invoice);
    // Counselor.hasMany(Service_Type);
    Counselor.hasOne(StripeConnect);
    Counselor.hasOne(ContactAddress);
    Counselor.hasOne(CounselorBillSetting);
    Counselor.belongsTo(User);
  };

  return Counselor;
};
