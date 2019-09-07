'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        firstname: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        lastname: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 3
        },
        publickey: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        mid: {
            type: DataTypes.STRING,
            defaultValue: ''
        }
    }, {
        indexes: [{
            unique: true,
            fields: ['id', 'username']
        }]
    });

    const cryptPassword = password => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject(err);

                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) return reject(err);
                    return resolve(hash);
                });
            });
        });
    };

    User.beforeCreate((user, options) => {
        return cryptPassword(user.password).then(success => {
            user.password = success;
        }).catch(err => {
            if (err) {
                throw err;
            }
        });
    });

    User.beforeBulkUpdate(({attributes, where}) => {
        if (attributes.password) {
            return cryptPassword(attributes.password).then(success => {
                attributes.password = success;
            }).catch(err => {
                if (err) {
                    throw err;
                }
            });
        }
    });

    User.associate = ({MyClient, Comment, Notification, UserEmail}) => {
        User.hasMany(MyClient);
        User.hasMany(Comment);
        User.hasMany(Notification);
        User.hasMany(UserEmail);
    };

    return User;
};
