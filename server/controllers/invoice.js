var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var invoiceModel = rfr('/server/models/invoice');

function create(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.create(req, res, cb);
}

module.exports = {
    create
}
