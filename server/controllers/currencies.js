var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var currencyModel = rfr('/server/models/currency');

function index(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    currencyModel.index(req, res, cb);
}

module.exports = {
    index
}
