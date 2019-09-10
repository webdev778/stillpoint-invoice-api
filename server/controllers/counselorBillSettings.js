var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var counselorBillSettingModel = rfr('/server/models/counselorBillSetting');

function index(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    counselorBillSettingModel.index(req, res, cb);
}

function create(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    counselorBillSettingModel.updateorcreate(req, res, cb);
}

module.exports = {
    index,
    create,
    // show,
    // update
}
