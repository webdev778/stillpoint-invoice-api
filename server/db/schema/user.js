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
        timezone: {
            type: DataTypes.STRING
        },
        admin: {
            type: DataTypes.BOOLEAN
        },
        email: {
            type: DataTypes.STRING
        },
        avatarFileName: {
            type: DataTypes.STRING
        },
        avatarContentType: {
            type: DataTypes.STRING
        },
        avatarFileSize: {
            type: DataTypes.INTEGER
        },
        avatarUpdatedAt: {
            type: DataTypes.DATE
        },
        lastName: {
            type: DataTypes.STRING
        },
        signUpReason: {
            type: DataTypes.STRING
        },
        gender: {
            type: DataTypes.STRING
        },
        dateOfBirth: {
            type: DataTypes.DATE
        }
    });
    User.associate = ({ ClientContactAddress, Counselor }) => {
        User.ClientContactAddress = User.hasMany(ClientContactAddress);
    //     User.hasMany(Invoice);
        User.hasOne(Counselor);
    };


    return User;
};

