'use strict';

module.exports = (sequelize, DataTypes) => {

    const Counselor = sequelize.define('Counselor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING
        },
        tagline: {
            type: DataTypes.STRING
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
            type: DataTypes.STRING
        },
        highResImageContentType: {
            type: DataTypes.STRING
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
            type: DataTypes.STRING
        },
        googleMapsUrl: {
            type: DataTypes.STRING
        },
        vimeoUrl: {
            type: DataTypes.STRING
        },
        soundcloudUrl: {
            type: DataTypes.STRING
        },
        languageId: {
            type: DataTypes.INTEGER
        },
        slidingScale: {
            type: DataTypes.BOOLEAN
        },
        googlePlusUrl: {
            type: DataTypes.STRING
        },
        facebookUrl: {
            type: DataTypes.STRING
        },
        meetupUrl: {
            type: DataTypes.STRING
        },
        pinterestUrl: {
            type: DataTypes.STRING
        },
        twitterUrl: {
            type: DataTypes.STRING
        },
        instagramUrl: {
            type: DataTypes.STRING
        },
        tumblrUrl: {
            type: DataTypes.STRING
        },
        website: {
            type: DataTypes.STRING
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
            type: DataTypes.STRING
        },
        stripeSk: {
            type: DataTypes.STRING
        },
        stripePk: {
            type: DataTypes.STRING
        },
        defaultCityId: {
            type: DataTypes.INTEGER
        },
        currency: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
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
            type: DataTypes.STRING
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
            type: DataTypes.STRING
        },
        stillpointPercentage: {
            type: DataTypes.FLOAT
        },
        subscriptionRequired: {
            type: DataTypes.BOOLEAN
        },
        skypeId: {
            type: DataTypes.STRING
        }
    });
    Counselor.associate = ({ Invoice, Service_Type, CounselorBillSetting, User }) => {

        // Counselor.hasMany(Invoice);
        // Counselor.hasMany(Service_Type);
        // Counselor.hasMany(Counselor_Bill_Setting);
        Counselor.User = Counselor.belongsTo(User);
    };

    return Counselor;
};

