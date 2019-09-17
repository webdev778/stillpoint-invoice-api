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
        encryptedPassword: {
            type: DataTypes.STRING
        },
        resetPasswordToken: {
            type: DataTypes.STRING
        },
        resetPasswordSentAt: {
            type: DataTypes.DATE
        },
        rememberCreatedAt: {
            type: DataTypes.DATE
        },
        confirmationToken: {
            type: DataTypes.STRING
        },
        confirmedAt: {
            type: DataTypes.DATE
        },
        confirmationSentAt: {
            type: DataTypes.DATE
        },
        unconfirmedEmail: {
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
        wantsNewsletter: {
            type: DataTypes.BOOLEAN
        },
        sentOrderForNewsletter: {
            type: DataTypes.BOOLEAN
        },
        sentInstructions: {
            type: DataTypes.BOOLEAN
        },
        signInCount: {
            type: DataTypes.INTEGER
        },
        currentSignInAt: {
            type: DataTypes.DATE
        },
        lastSignInAt: {
            type: DataTypes.DATE
        },
        currentSignInIp: {
            type: DataTypes.STRING
        },
        lastSignInIp: {
            type: DataTypes.STRING
        },
        slug: {
            type: DataTypes.STRING
        },
        signUpReason: {
            type: DataTypes.STRING
        },
        uuid: {
            type: DataTypes.STRING
        },
        berlinUserId: {
            type: DataTypes.INTEGER
        },
        signUpCityId: {
            type: DataTypes.INTEGER
        },
        stripeCustomerId: {
            type: DataTypes.STRING
        },
        invitationToken: {
            type: DataTypes.STRING
        },
        labId: {
            type: DataTypes.INTEGER
        },
        erased: {
            type: DataTypes.BOOLEAN
        },
        gender: {
            type: DataTypes.STRING
        },
        dateOfBirth: {
            type: DataTypes.DATE
        },
        forumAdmin: {
            type: DataTypes.BOOLEAN
        },
        termsOfService: {
            type: DataTypes.DATE
        },
        privacyPolicy: {
            type: DataTypes.DATE
        },
        trialDays: {
            type: DataTypes.INTEGER
        },
        freeTrial: {
            type: DataTypes.BOOLEAN
        },
        freeTrialStartDate: {
            type: DataTypes.DATE
        },
        failedAttempts: {
            type: DataTypes.INTEGER
        },
        unlockToken: {
            type: DataTypes.STRING
        },
        lockedAt: {
            type: DataTypes.DATE
        },
        fiscalCode: {
            type: DataTypes.STRING
        },
        companiesId: {
            type: DataTypes.INTEGER
        },
        companyId: {
            type: DataTypes.INTEGER

        }
    });
    User.associate = ({ ClientContactAddress, Counselor }) => {
        User.ClientContactAddress = User.hasMany(ClientContactAddress, { as: 'clientContactAddress'});
    //     User.hasMany(Invoice);
        User.hasOne(Counselor);
    };


    return User;
};

