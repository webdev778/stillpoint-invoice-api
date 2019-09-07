'use strict';
var rfr = require('rfr'),
    moment = require('moment'),
    _ = require('lodash');

var config = rfr('/server/shared/config'),
    constant = rfr('/server/shared/constant'),
    mailHelper = rfr('/server/shared/mailHelper'),
    utils = rfr('/server/shared/utils');

var stripeAccountsSchema = rfr('/server/schemas/ddl/stripeAccounts');

var helper = rfr('/server/models/shared/helper'),
    validator = rfr('/server/models/shared/validator'),
    negotiateTermsModel = rfr('/server/models/negotiateTerms'),
    wNineInfoModel = rfr('/server/models/wNineInfo');

/**
 * @method create
 * @used for create an invoice
 * @param object req, object res
 * @return object res
 * @author webdev778
 */
function create(req, res, callback) {
    utils.writeInsideFunctionLog('invoice', 'create');

    callback({Code: 200, Status: true, Message: constant['REQUEST_OK'], Data: "test data"});
}

module.exports = (sequelize, DataTypes) => {

    const Invoice = sequelize.define('Invoice', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        invoice_sn: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        invoice_type: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        invoice_interval: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        subject: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        tax: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        currency_id: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        sender_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sender_street: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sender_city: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sender_post_code: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        sender_coutnry: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_name: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_street: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_city: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_post_code: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        recipient_country: {
            type: DataTypes.CHAR,
            defaultValue: ''
        },
        total: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        paid_amount: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        notes: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 'draft'
        },
        issue_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        due_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        viewed_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        sent_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        },
        paid_at: {
            type: DataTypes.DATE,
            defaultValue: ''
        }
    });
    Invoice.associate = ({ Counselor, Client, Payment, Services }) => {
        Invoice.belongsTo(Counselor, { as: 'counselor', foreignKey: 'counselor_id', onDelete: 'cascade' });
        Invoice.belongsTo(Client, { as: 'counselor', foreignKey: 'client_id', onDelete: 'cascade' });
        Invoice.belongsTo(Payment, { as: 'counselor', foreignKey: 'payment_id', onDelete: 'cascade' });
        Invoice.hasMany(Services);
    };

    return Invoice;
};

