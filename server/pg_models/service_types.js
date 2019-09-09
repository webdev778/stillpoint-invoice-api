'use strict';
module.exports = (sequelize, DataTypes) => {
    const Service_Types = sequelize.define('Services_Types', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.CHAR
        },
        type: {
            type: DataTypes.INTEGER
        },
        price: {
            type: DataTypes.INTEGER
        }
    });
    // Service_Types.associate = ({Services}) => {
    //     Service_Types.hasMany(Services);
    //     Service.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
    // };
    return Service_Types;
};