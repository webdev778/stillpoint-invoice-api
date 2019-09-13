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

  // get counselor_id or client_id from auth
  const userRole = 1;
  const counselorId = 5;
  const clientId = 10;
  if (userRole) {
    db.Invoice.findAll({
      // where: { 'counselorId': counselorId },
      attributes: invoice_whiltelist,
      include: [{
        association: db.Invoice.Services,
        as: 'services',
        attributes: ['id', 'name', 'description', 'quantity', 'unitPrice', 'taxCharge']
      }]
    }).then(invoices => {
      cb(invoices);
    }).catch(err => {
      cb({ Code: 500, Status: false, Message: 'model error' })
    })
  } else {
    db.Invoice.findAll({
      where: { 'clientId': clientId },
      attributes: invoice_whiltelist,
      include: [{
        association: db.Invoice.Services,
        as: 'services',
        attributes: ['id', 'name', 'description', 'quantity', 'unitPrice', 'taxCharge']
      }]
    }).then(invoices => {
      cb(invoices);
    }).catch(err => {
      cb({ Code: 500, Status: false, Message: 'model error' })
    })
  }
}

const create = async (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'create');


  try {

    const result = await db.Invoice.create(req.body, {
      attributes: ['invoiceSn', 'invoiceType', 'clientId', 'counselorId', 'subject', 'tax', 'currencyId', 'total', 'amount', 'status']
      , include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['name', 'quantity', 'unitPrice', 'taxCharge']
        }]
    });

    cb({ Code: 200, Status: true, Message: result });
  } catch (e) {
    console.log(e);
    cb({ Code: 500, Status: true, Message: 'Failed to create inovice' });
  }
}

const update = async (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'update');

  const invoiceId = req.params.invoiceId;
  const invoice = req.body;
  const services = invoice.services;

  try {

    if (!invoiceId) {
      cb({ Code: 400, Status: true, Message: '' });
      return;
    }

    const foundInvoice = await db.Invoice.findOne({
      where: { 'id': invoiceId },
      include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['id', 'name', 'quantity', 'unitPrice', 'taxCharge']
        }]
    });

    if (!foundInvoice) {
      cb({ Code: 400, Status: true, Message: '' });
      return;
    }

    await foundInvoice.update(invoice, {
      attributes: ['invoiceSn', 'subject', 'tax', 'currencyId', 'notes'],
      returning: true,
      plain: true
    });

    services.forEach(async service => {
      const dbService = await db.Service.findOne({ where: { 'id': service.id, 'invoiceId': invoiceId } });
      if (!!dbService) {
        await dbService.update(service, { attributes: ['invoiceSn', 'subject', 'tax', 'currencyId', 'notes'] });
      }
    });

    const ret = await db.Invoice.findOne({
      where: { id: invoiceId },
      attributes: ['invoiceSn', 'invoiceType', 'clientId', 'counselorId', 'subject', 'tax', 'currencyId', 'total', 'amount', 'status', 'issueAt', 'dueAt', 'sentAt', 'paidAt'],
      include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['name', 'quantity', 'unitPrice', 'taxCharge']
        }]
    });

    cb(ret);
  } catch (e) {
    console.log(e);
    cb({ Code: 500, Status: true, Message: 'Failed to update inovice' });
  }
}

const destroy = async (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'destory');

  const invoiceId = req.params.invoiceId;
  console.log(invoiceId);
  try {

    if (!invoiceId) {
      cb({ Code: 400, Status: true, Message: '' });
      return;
    }

    const foundInvoice = await db.Invoice.findOne({
      where: { 'id': invoiceId },
      include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['name', 'quantity', 'unitPrice', 'taxCharge']
        }]
    });

    if (!foundInvoice) {
      cb({ Code: 400, Status: true, Message: '' });
      return;
    }

    await foundInvoice.destroy();

    cb({ Code: 200, Status: true, Message: 'Successfully Deleted' });
  } catch (e) {
    console.log(e);
    cb({ Code: 500, Status: true, Message: 'Failed to update inovice' });
  }
}

const send = async (req, res, cb) => {
  const id = req.params.id;

  if (!id) {
    cb({ Code: 400, Status: true, Message: 'Bad Request' });
    return;
  }

  try {
    // send email

    // update invoice status
    const invoice = await db.Invoice.findOne({ where: { 'id': id } })
    if (!invoice) {
      cb({ Code: 400, Status: true, Message: 'Bad Request' });
      return;
    }

    await invoice.update({ 'status': 1 });

    cb({ Code: 200, Status: true, Message: 'Sent Successfully' });
  } catch (e) {
    console.log(e);
    cb({ Code: 500, Status: true, Message: 'Failed to send invoice' });
  }
}

const findById = (id) => {
  return db.Invoice.findOne({
    where: { id },
    include: [
      {
        model: db.Counselor,
        include: [db.StripeConnect]
      },
      {
        association: db.Invoice.Services,
        as: 'services',
      },
      db.Currency]
  });
}

const setStatusAsPaid = (id) => {
  return db.Invoice.update({ status: 2 },
    {
      where: { id }
    })
}

module.exports = {
  index,
  create,
  update,
  destroy,
  send,
  findById,
  setStatusAsPaid
}