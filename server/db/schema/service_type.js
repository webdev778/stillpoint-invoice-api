"use strict";
module.exports = (sequelize, DataTypes) => {
  const Service_Type = sequelize.define("Service_Type", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    counselorId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.INTEGER
    },
    price: {
      type: DataTypes.INTEGER
    }
  });
  // Service_Type.associate = ({ Service, Counselor }) => {
  //     Service_Type.hasMany(Service);
  //     Service_Type.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
  // };
  return Service_Type;
};
