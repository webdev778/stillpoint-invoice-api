"use strict";
module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define("Currency", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },

    code: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  // Currency.associate = ({ Counselor_Bill_Setting }) => {
  //     Currency.hasMany(Counselor_Bill_Setting);

  // };

  return Currency;
};
