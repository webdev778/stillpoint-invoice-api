var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var clientModel = rfr('/server/models/client');

function index(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    clientModel.index(req, res, cb);
}

module.exports = {
    index
}
