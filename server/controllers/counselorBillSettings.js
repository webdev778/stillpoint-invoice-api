var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var counselorBillSettingModel = rfr('/server/models/counselorBillSetting');

function show(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    counselorBillSettingModel.show(req, res, cb);
}

function create(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    counselorBillSettingModel.updateOrCreate(req, res, cb);
}

module.exports = {
    show,
    create,
    // show,
    // update
}
