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

module.exports = {
    create
}
