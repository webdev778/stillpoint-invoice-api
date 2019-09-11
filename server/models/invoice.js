'use strict';

var rfr = require('rfr'),
moment = require('moment'),
_ = require('lodash');

var config = rfr('/server/shared/config'),
constant = rfr('/server/shared/constant'),
mailHelper = rfr('/server/shared/mailHelper'),
utils = rfr('/server/shared/utils'),
db = rfr('/server/db');

const invoice_whiltelist = ['id', 'invoiceSn', 'invoiceType', 'clientId', 'counselorId', 
'invoiceInterval', 'subject', 'tax', 'currencyId', 'senderName', 'senderStreet', 'senderCity', 'senderPostCode',
'senderCountry', 'recipientName', 'recipientStreet', 'recipientCity', 'recipientPostCode', 'recipientCountry', 'total', 'amount', 'paidAmount', 'notes',
'paymentId', 'status', 'issueAt', 'dueAt', 'viewedAt', 'sentAt', 'paidAt'];

function index(req, res, cb) {
  utils.writeInsideFunctionLog('invoices', 'index');
  // cb({Code: 200, Status: true, Message: 'invoices/index'});
  db.Invoice.findAll({
    attributes: invoice_whiltelist,
    include: [{
      association: db.Invoice.Services,
      as: 'services',
      attributes: ['id', 'name', 'description', 'quantity', 'unitPrice', 'taxCharge']
    }]
  }).then(invoices => {
    cb(invoices);
  }).catch(err => {
    cb({Code: 500, Status: false, Message: 'model error'})
  })
}

const create = async (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'create');

  
  try{
    
    const result = await db.Invoice.create(req.body, {
      attributes: ['invoiceSn', 'invoiceType', 'clientId', 'counselorId', 'subject', 'tax', 'currencyId', 'total', 'amount', 'status']     
      ,include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['name', 'quantity', 'unitPrice', 'taxCharge']
        }]
      });
      
    cb({Code: 200, Status: true, Message: result});
  }catch(e){
    console.log(e);
    cb({Code: 500, Status: true, Message: 'Failed to create inovice'});
  }
}

module.exports = {
  index,
  create
}