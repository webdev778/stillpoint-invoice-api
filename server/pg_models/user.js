'use strict';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        }
    });
    User.associate = ({ ClientContactAddress, Counselor }) => {
        User.ClientContactAddress = User.hasMany(ClientContactAddress, { as: 'clientContactAddress'});
    //     User.hasMany(Invoice);
        User.hasOne(Counselor);
    };


    return User;
};

