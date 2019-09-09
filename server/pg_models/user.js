'use strict';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        firstMame: {
            type: DataTypes.CHAR
        },
        timezone: {
            type: DataTypes.CHAR
        },
        admin: {
            type: DataTypes.BOOLEAN
        },
        email: {
            type: DataTypes.CHAR
        },
        encryptedPassword: {
            type: DataTypes.CHAR
        },
        resetPasswordToken: {
            type: DataTypes.CHAR
        },
        resetPasswordSentAt: {
            type: DataTypes.TIME
        },
        rememberCreatedAt: {
            type: DataTypes.TIME
        },
        confirmationToken: {
            type: DataTypes.CHAR
        },
        confirmedAt: {
            type: DataTypes.TIME
        },
        confirmationSentAt: {
            type: DataTypes.TIME
        },
        unconfirmedEmail: {
            type: DataTypes.CHAR
        },
        createdAt: {
            type: DataTypes.TIME
        },
        updatedAt: {
            type: DataTypes.TIME
        },
        avatarFileName: {
            type: DataTypes.CHAR
        },
        avatarContentType: {
            type: DataTypes.CHAR
        },
        avatarFileSize: {
            type: DataTypes.INTEGER
        },
        avatarUpdatedAt: {
            type: DataTypes.TIME
        },
        lastName: {
            type: DataTypes.CHAR
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
            type: DataTypes.TIME
        },
        lastSignInAt: {
            type: DataTypes.TIME
        },
        currentSignInIp: {
            type: DataTypes.CHAR
        },
        lastSignInIp: {
            type: DataTypes.CHAR
        },
        slug: {
            type: DataTypes.CHAR
        },
        signUpReason: {
            type: DataTypes.CHAR
        },
        uuid: {
            type: DataTypes.CHAR
        },
        berlinUserId: {
            type: DataTypes.INTEGER
        },
        signUpCityId: {
            type: DataTypes.INTEGER
        },
        stripeCustomerId: {
            type: DataTypes.CHAR
        },
        invitationToken: {
            type: DataTypes.CHAR
        },
        labId: {
            type: DataTypes.INTEGER
        },
        erased: {
            type: DataTypes.BOOLEAN
        },
        gender: {
            type: DataTypes.CHAR
        },
        dateOfBirth: {
            type: DataTypes.DATE
        },
        forumAdmin: {
            type: DataTypes.BOOLEAN
        },
        termsOfService: {
            type: DataTypes.TIME
        },
        privacyPolicy: {
            type: DataTypes.TIME
        },
        trialDays: {
            type: DataTypes.INTEGER
        },
        freeTrial: {
            type: DataTypes.BOOLEAN
        },
        freeTrialStartDate: {
            type: DataTypes.TIME
        },
        failedAttempts: {
            type: DataTypes.INTEGER
        },
        unlockToken: {
            type: DataTypes.CHAR
        },
        lockedAt: {
            type: DataTypes.TIME
        },
        fiscalCode: {
            type: DataTypes.CHAR
        },
        companiesId: {
            type: DataTypes.INTEGER
        },
        companyId: {
            type: DataTypes.INTEGER

        }
    });
    // User.associate = ({ Invoice }) => {

    //     User.hasMany(Invoice);
    // };

    return User;
};

