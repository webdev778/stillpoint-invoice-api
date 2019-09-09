'use strict';

var rfr = require('rfr'),
moment = require('moment'),
_ = require('lodash');

var config = rfr('/server/shared/config'),
constant = rfr('/server/shared/constant'),
mailHelper = rfr('/server/shared/mailHelper'),
utils = rfr('/server/shared/utils'),
db = rfr('/server/db');

function index(req, res, cb) {
  utils.writeInsideFunctionLog('invoices', 'index');
  // cb({Code: 200, Status: true, Message: 'invoices/index'});
  db.Invoice.findAll().then(invoices => {
    cb(invoices);
  }).catch(err => {
    cb({Code: 500, Status: false, Message: 'model error'})
  })
}

const create = async (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'create');

  const newInvoice = req.body;
  const result = await db.Invoice.create(newInvoice)
  cb({Code: 200, Status: true, Message: result});
}

module.exports = {
  index,
  create
}