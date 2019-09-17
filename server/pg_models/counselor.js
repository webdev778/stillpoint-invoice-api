"use strict";

module.exports = (sequelize, DataTypes) => {
  const Counselor = sequelize.define("Counselor", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  });
  Counselor.associate = ({
    Invoice,
    Service_Type,
    CounselorBillSetting,
    User,
    StripeConnect
  }) => {
    // Counselor.hasMany(Invoice);
    // Counselor.hasMany(Service_Type);
    Counselor.hasOne(StripeConnect);
    Counselor.CounselorBillSetting = Counselor.hasOne(CounselorBillSetting);
    Counselor.User = Counselor.belongsTo(User);
  };

  return Counselor;
};
