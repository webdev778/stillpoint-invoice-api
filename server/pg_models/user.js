'use strict';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
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
            type: DataTypes.BIGINT
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
            type: DataTypes.BIGINT
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
            type: DataTypes.BIGINT
        },
        signUpCityId: {
            type: DataTypes.BIGINT
        },
        stripeCustomerId: {
            type: DataTypes.STRING
        },
        invitationToken: {
            type: DataTypes.STRING
        },
        labId: {
            type: DataTypes.BIGINT
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
            type: DataTypes.BIGINT
        },
        freeTrial: {
            type: DataTypes.BOOLEAN
        },
        freeTrialStartDate: {
            type: DataTypes.DATE
        },
        failedAttempts: {
            type: DataTypes.BIGINT
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
            type: DataTypes.BIGINT
        },
        companyId: {
            type: DataTypes.BIGINT

        }
    });
    User.associate = ({ ClientContactAddress }) => {
        User.ClientContactAddress = User.hasMany(ClientContactAddress, { as: 'clientContactAddress'});
    //     User.hasMany(Invoice);
    };


    return User;
};

