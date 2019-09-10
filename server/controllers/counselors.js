var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var counselorModel = rfr('/server/models/counselor');

function index(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    counselorModel.index(req, res, cb);
}

module.exports = {
    index
}
