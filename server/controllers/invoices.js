var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var invoiceModel = rfr('/server/models/invoice');

function index(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.index(req, res, cb);
}

function show(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.show(req, res, cb);
}

function create(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.create(req, res, cb);
}

function update(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.update(req, res, cb);
}

function destroy(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.destroy(req, res, cb);
}

function send(req, res) {
    var cb = function (result) {
        utils.sendResponse(res, result);
    }
    invoiceModel.send(req, res, cb);
}

const type = (req, res) => {
    const result = [
        {
            id: 0,
            typeName: 'Normal'
        },
        {
            id: 1,
            typeName: 'Recrurring'
        }
    ];
    utils.sendResponse(res, result);
}

const status = (req, res) => {
    const result = [
        {
            id: 0,
            status: 'Draft'
        },
        {
            id: 1,
            status: 'Sent'
        },
        {
            id: 2,
            status: 'Paid'
        }
    ];
    utils.sendResponse(res, result);
}

const newInvoice = async (req, res) => {
    const { userInfo: user }  = req;
    const { counselorId, clientId } = req.body;

    if (!user.isCounsellor){
        return utils.sendResponse(res, {Code: 400, Message: 'it\'s not  permitted to call this endpoint for you'});
    }

    if (counselorId !== user.counselorId){
        return utils.sendResponse(res, {Code: 400, Message: 'The counselor id in the reqeust not matched with user info '});
    }


    try{
        const result = await invoiceModel.getNewInvoiceSn(counselorId);
        utils.sendResponse(res, {newInvoiceId: result[0].nextSn});
    }catch(e){
        console.log(e);
        utils.sendResponse(res, {Code: 500, Message: 'Internal Server Error'});
    }
}

module.exports = {
    index,
    show,
    newInvoice,
    create,
    update,
    destroy,
    type,
    status,
    send
}
