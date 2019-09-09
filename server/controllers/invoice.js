var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var invoiceModel = rfr('/server/models/invoice');

function index(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.index(req, res, cb);
}

function create(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.create(req, res, cb);
}

module.exports = {
    index,
    create,
    // show,
    // update
}
