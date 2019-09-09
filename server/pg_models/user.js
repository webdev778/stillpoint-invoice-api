'use strict';

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        timezone: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        email: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        encrypted_password: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        reset_password_token: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        reset_password_sent_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        remember_created_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        confirmation_token: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        confirmed_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        confirmation_sent_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        unconfirmed_email: {
            type: DataTypes.CHAR,
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
        avatar_file_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        avatar_content_type: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        avatar_file_size: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        avatar_updated_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        last_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        wants_newsletter: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        sent_order_for_newsletter: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        sent_instructions: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        sign_in_count: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        current_sign_in_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        last_sign_in_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        current_sign_in_ip: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        last_sign_in_ip: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        slug: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sign_up_reason: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        uuid: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        berlin_user_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        sign_up_city_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        stripe_customer_id: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        invitation_token: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        lab_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        erased: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        gender: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        date_of_birth: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        forum_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        terms_of_service: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        privacy_policy: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        trial_days: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        free_trial: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        },
        free_trial_start_date: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        failed_attempts: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        unlock_token: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        locked_at: {
            type: DataTypes.TIME,
            defaultValue: ''
        },
        fiscal_code: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        companies_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        company_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        }
    });
    // User.associate = ({ Invoice }) => {

    //     User.hasMany(Invoice);
    // };

    return User;
};

