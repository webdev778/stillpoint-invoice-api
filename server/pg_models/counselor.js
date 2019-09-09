'use strict';

module.exports = (sequelize, DataTypes) => {

    const Counselor = sequelize.define('Counselor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: {
            type: DataTypes.CHAR
        },
        tagline: {
            type: DataTypes.CHAR
        },
        about: {
            type: DataTypes.TEXT
        },
        howIWork: {
            type: DataTypes.TEXT
        },
        education: {
            type: DataTypes.TEXT
        },
        userId: {
            type: DataTypes.INTEGER
        },
        createdAt: {
            type: DataTypes.TIME
        },
        updatedAt: {
            type: DataTypes.TIME
        },
        highResImageFileName: {
            type: DataTypes.CHAR
        },
        highResImageContentType: {
            type: DataTypes.CHAR
        },
        highResImageFileSize: {
            type: DataTypes.INTEGER
        },
        highResImageUpdatedAt: {
            type: DataTypes.TIME
        },
        pricePerSessionHour: {
            type: DataTypes.INTEGER
        },
        experience: {
            type: DataTypes.TEXT
        },
        hidden: {
            type: DataTypes.BOOLEAN
        },
        available: {
            type: DataTypes.BOOLEAN
        },
        blogUrl: {
            type: DataTypes.CHAR
        },
        googleMapsUrl: {
            type: DataTypes.CHAR
        },
        vimeoUrl: {
            type: DataTypes.CHAR
        },
        soundcloudUrl: {
            type: DataTypes.CHAR
        },
        languageId: {
            type: DataTypes.INTEGER
        },
        slidingScale: {
            type: DataTypes.BOOLEAN
        },
        googlePlusUrl: {
            type: DataTypes.CHAR
        },
        facebookUrl: {
            type: DataTypes.CHAR
        },
        meetupUrl: {
            type: DataTypes.CHAR
        },
        pinterestUrl: {
            type: DataTypes.CHAR
        },
        twitterUrl: {
            type: DataTypes.CHAR
        },
        instagramUrl: {
            type: DataTypes.CHAR
        },
        tumblrUrl: {
            type: DataTypes.CHAR
        },
        website: {
            type: DataTypes.CHAR
        },
        adminNotifiedAt: {
            type: DataTypes.TIME
        },
        updatedAttributes: {
            type: DataTypes.HSTORE
        },
        storedPayoutDetails: {
            type: DataTypes.TEXT
        },
        paidOutsideAdyen: {
            type: DataTypes.BOOLEAN
        },
        berlinCounselorId: {
            type: DataTypes.INTEGER
        },
        summary: {
            type: DataTypes.TEXT
        },
        isUsingStripe: {
            type: DataTypes.BOOLEAN
        },
        stripeAccountId: {
            type: DataTypes.CHAR
        },
        stripeSk: {
            type: DataTypes.CHAR
        },
        stripePk: {
            type: DataTypes.CHAR
        },
        defaultCityId: {
            type: DataTypes.INTEGER
        },
        currency: {
            type: DataTypes.CHAR
        },
        state: {
            type: DataTypes.CHAR
        },
        notifiedApprovedAt: {
            type: DataTypes.TIME
        },
        activeSubscription: {
            type: DataTypes.BOOLEAN
        },
        showPricePerSession: {
            type: DataTypes.BOOLEAN
        },
        linkedinUrl: {
            type: DataTypes.CHAR
        },
        onlineSession: {
            type: DataTypes.BOOLEAN
        },
        inPersonSession: {
            type: DataTypes.BOOLEAN
        },
        ethics: {
            type: DataTypes.TIME
        },
        subscription: {
            type: DataTypes.CHAR
        },
        stillpointPercentage: {
            type: DataTypes.FLOAT
        },
        subscriptionRequired: {
            type: DataTypes.BOOLEAN
        },
        skypeId: {
            type: DataTypes.CHAR
        }
    });
    // Counselor.associate = ({ Invoice }) => {

    //     Counselor.hasMany(Invoice);
    //     Counselor.hasMany(Service_Types);
    //     Counselor.hasMany(Invoice_Detail);
    // };

    return Counselor;
};

