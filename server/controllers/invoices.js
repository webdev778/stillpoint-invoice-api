const rfr = require('rfr');

const utils = rfr('/server/shared/utils');
const constant = rfr('/server/shared/constant');
const invoiceModel = rfr('/server/models/invoice');

function index(req, res) {
  const cb = function (result) {
    utils.sendResponse(res, result);
  }
  invoiceModel.index(req, res, cb);
}

function show(req, res) {
  const cb = function (result) {
    utils.sendResponse(res, result);
  }
  invoiceModel.show(req, res, cb);
}

function create(req, res) {
  const cb = function (result) {
    utils.sendResponse(res, result);
  }
  invoiceModel.create(req, res, cb);
}

function update(req, res) {
  const cb = function (result) {
    utils.sendResponse(res, result);
  }
  invoiceModel.update(req, res, cb);
}

function destroy(req, res) {
  const cb = function (result) {
    utils.sendResponse(res, result);
  }
  invoiceModel.destroy(req, res, cb);
}

function send(req, res) {
  const cb = function (result) {
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
  const { userInfo: user } = req;
  const { counselorId, clientId } = req.body;

  if (!user.isCounsellor) {
    return utils.sendResponse(res, { Code: 400, Message: 'it\'s not  permitted to call this endpoint for you' });
  }

  if (counselorId !== user.counselorId) {
    return utils.sendResponse(res, { Code: 400, Message: 'The counselor id in the reqeust not matched with user info ' });
  }


  try {
    const result = await invoiceModel.getNewInvoiceSn(counselorId);
    utils.sendResponse(res, { newInvoiceId: result[0].nextSn });
  } catch (e) {
    console.log(e);
    utils.sendResponse(res, { Code: 500, Message: 'Internal Server Error' });
  }
}

const offpay = async (req, res) => {
  const { id } = req.params;
  const { userInfo: user } = req;

  try {
    const inv = await invoiceModel.findById(id);

    console.log(user);
    try{
      if(!inv) throw Error('Invoice not existing');
      if(!user.isCounsellor) throw('This is only permited only for counselor');
      if(user.counselorId !== inv.counselorId) {
        throw('The current user is not the issuer for the invoice');
        console.log(inv.counselorId);
      }

      if(inv.status === constant.INVOICE_PAID) throw('The status of invoice does not meet precondition to turn out void');

    }catch(e){
      console.log(e.message);
      utils.writeErrorLog('invoice', 'offpay', 'Error while validating the request', e);
      return utils.sendResponse(res, { Code: 400, Message: 'Bad Request' });
    }

    const result = await invoiceModel.markAsPaid(id);
    res.send(result[1]);
  } catch (e) {
    console.log(e);
    return utils.sendResponse(res, { Code: 500, Message: 'Internal Server Error!' });
  }
}

const voidInvoice = async (req, res) => {
  const { id } = req.params;
  const { userInfo: user } = req;

  try {
    const inv = await invoiceModel.findById(id);

    console.log(user);
    try{
      if(!inv) throw Error('Invoice not existing');
      if(!user.isCounsellor) throw('This is only permited only for counselor');
      if(user.counselorId !== inv.counselorId) {
        throw('The current user is not the issuer for the invoice');
        console.log(inv.counselorId);
      }
    }catch(e){
      console.log(e.message);
      utils.writeErrorLog('invoice', 'offpay', 'Error while validating the request', e);
      return utils.sendResponse(res, { Code: 400, Message: 'Bad Request' });
    }

    const result = await invoiceModel.markAsVoid(id);
    res.send(result[1]);
  } catch (e) {
    console.log(e);
    return utils.sendResponse(res, { Code: 500, Message: 'Internal Server Error!' });
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
  send,
  offpay,
  void: voidInvoice
}
