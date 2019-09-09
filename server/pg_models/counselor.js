'use strict';

module.exports = (sequelize, DataTypes) => {

    const Counselor = sequelize.define('Counselor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        title: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        tagline: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        about: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        how_i_work: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        education: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        user_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        created_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        updated_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        high_res_image_file_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        high_res_image_content_type: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        high_res_image_file_size: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        high_res_image_updated_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        price_per_session_hour: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        experience: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        hidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        blog_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        google_maps_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        vimeo_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        soundcloud_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        language_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        sliding_scale: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        google_plus_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        facebook_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        meetup_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        pinterest_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        twitter_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        instagram_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        tumblr_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        website: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        admin_notified_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        updated_attributes: {
            type: DataTypes.HSTORE,
            defaultValue: ''
        },
        stored_payout_details: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        paid_outside_adyen: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        berlin_counselor_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        summary: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        is_using_stripe: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        stripe_account_id: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        stripe_sk: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        stripe_pk: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        default_city_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        currency: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        state: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        notified_approved_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        active_subscription: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        show_price_per_session: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        linkedin_url: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        online_session: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        in_person_session: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        ethics: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        subscription: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        stillpoint_percentage: {
            type: DataTypes.FLOAT,
            defaultValue: ''
        },
        subscription_required: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        skype_id: {
            type: DataTypes.CHAR,
            defaultValue: ''
        }
    });
    // Counselor.associate = ({ Invoice }) => {

    //     Counselor.hasMany(Invoice);
    //     Counselor.hasMany(Service_Types);
    //     Counselor.hasMany(Invoice_Detail);
    // };

    return Counselor;
};

