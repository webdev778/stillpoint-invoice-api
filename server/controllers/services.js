var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var serviceModel = rfr('/server/models/service');

function index(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    serviceModel.index(req, res, cb);
}

function create(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    serviceModel.create(req, res, cb);
}

module.exports = {
    index,
    create,
    // show,
    // update
}
