'use strict';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        firstMame: {
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
            type: DataTypes.TIME
        },
        rememberCreatedAt: {
            type: DataTypes.TIME
        },
        confirmationToken: {
            type: DataTypes.STRING
        },
        confirmedAt: {
            type: DataTypes.TIME
        },
        confirmationSentAt: {
            type: DataTypes.TIME
        },
        unconfirmedEmail: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.TIME
        },
        updatedAt: {
            type: DataTypes.TIME
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
            type: DataTypes.TIME
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
            type: DataTypes.TIME
        },
        lastSignInAt: {
            type: DataTypes.TIME
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
            type: DataTypes.STRING
        },
        lockedAt: {
            type: DataTypes.TIME
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
    // User.associate = ({ Invoice }) => {

    //     User.hasMany(Invoice);
    // };

    return User;
};

