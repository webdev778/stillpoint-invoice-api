"use strict";
module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define("Currency", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    code: {
      type: DataTypes.STRING
    },

    symbol: {
      type: DataTypes.STRING
    }
  });

  // Currency.associate = ({ Counselor_Bill_Setting }) => {
  //     Currency.hasMany(Counselor_Bill_Setting);

  // };

  return Currency;
};
