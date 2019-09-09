'use strict';
module.exports = (sequelize, DataTypes) => {
    const Service_Types = sequelize.define('Services_Types', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        type: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        price: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        }
    });
    Service_Types.associate = ({Services}) => {
        Service_Types.hasMany(Services);
    };
    return Service_Types;
};