'use strict';

var rfr = require('rfr'),
  moment = require('moment'),
  _ = require('lodash');
const axios = require('axios');


var config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  mailHelper = rfr('/server/shared/mailHelper'),
  utils = rfr('/server/shared/utils'),
  logger = rfr('/server/shared/logger'),
  db = rfr('/server/db');
  const counselorModel = rfr('/server/models/counselor');

const invoice_whiltelist = ['id', 'invoiceSn', 'invoiceType', 'clientId', 'counselorId',
  'sendEvery', 'subject', 'tax', 'currencyId', 'senderName', 'senderStreet', 'senderCity', 'senderPostCode',
  'senderCountry', 'recipientName', 'recipientStreet', 'recipientCity', 'recipientPostCode', 'recipientCountry', 'total', 'amount', 'paidAmount', 'notes',
  'dueDateOption', 'status', 'issueAt', 'dueAt', 'viewedAt', 'sentAt', 'paidAt', 'createdAt'];

const validateCreateRequest = (req) => {


  if(!req.issueAt) throw 'issueAt is invalid';
  if( (req.invoiceType !== 0 && !req.invoiceType) || req.invoiceType === undefined) throw Error('invoice type is invalid');

  switch (req.invoiceType){
    case constant.INVOICE_INDIVIDUAL:
        if(!req.dueDateOption) throw Error('dueDateOption is invalid');
        if(req.dueDateOption>4) throw Error('dueDateOption is invalid');
        break;
    case constant.INVOICE_RECURRING:
        if(!req.sendEvery) throw Error('sendEvery is invalid');
        break;
    default:
        throw Error('invoiceType is invalid');
  }

}

function index(req, res, cb) {
  utils.writeInsideFunctionLog('invoices', 'index');

  const { userInfo } = req;

  if(!userInfo) return cb({Code: 401});

  let condition = undefined;

  const Op = db.Sequelize.Op;

  if(userInfo.isCounsellor){
    condition = { 'counselorId': userInfo.counselorId  };
  }else{
    condition = { 'clientId': userInfo.id, status: { [Op.in]: [constant.INVOICE_SENT, constant.INVOICE_PAID]} };
  }

  db.Invoice.findAll({
    where: condition,
    attributes: [...invoice_whiltelist,
      [db.sequelize.literal(
        'EXISTS(select 1 from stripe_connects where stripe_connects.counselor_id = "Invoice".counselor_id and stripe_connects.revoked = false)'),
        'onlinePayable']
      ],
    include: [{
      association: db.Invoice.Services,
      as: 'services',
      // where: {
      //   deletedAt: {
      //   [Op.is]: null
      // }},
      attributes: ['id', 'name', 'description', 'quantity', 'unitPrice', 'taxCharge']
    }]
  }).then(invoices => {
    cb(invoices);
  }).catch(err => {
    console.log(err);
    utils.writeErrorLog('invoices', 'index', 'Error while findAll invoices', err);
    cb({ Code: 500, Status: false, Message: 'model error' })
  })
}

const show = (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'show');

  const id = req.params.id;

  const { userInfo } = req;

  if(!userInfo) return cb({Code:401});

  const condition = undefined;

  if(userInfo.isCounsellor)
    condition = { counselorId: userInfo.counselorId };
  else
    condition = { clientId: userInfo.id };

  db.Invoice.findOne({
    where: { id, ...condition },
    attributes: [...invoice_whiltelist,
      [db.sequelize.literal(
        'EXISTS(select 1 from stripe_connects where stripe_connects.counselor_id = "Invoice".counselor_id and stripe_connects.revoked = false)'),
        'onlinePayable']
      ],
    include: [{
      association: db.Invoice.Services,
      as: 'services',
      attributes: ['id', 'name', 'description', 'quantity', 'unitPrice', 'taxCharge']
    }]
  }).then(invoice => {
    cb(invoice);
  }).catch(err => {
    console.log(err);
    utils.writeErrorLog('invoices', 'show', 'Error while find invoice ', err);
    cb({ Code: 500, Status: false, Message: 'model error' })
  })
}

const create = async (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'create');

  try {
    const newInvoice = req.body;
    const { invoiceType: type } = newInvoice;


    const dueDate = {
      0: undefined,
      1: 10,
      2: 15,
      3: 30,
      4: 60
    };

    // validate request
    try {
      validateCreateRequest(req.body);
    }catch(e){
      console.log('validate error', e);
      return cb({Code: 400, Status: true, Message: e.message});
    }

    if(type === constant.INVOICE_INDIVIDUAL) {
      newInvoice.dueAt = moment(newInvoice.issueAt).add(dueDate[newInvoice.dueDateOption], 'day').format();
    }

    const result = await db.Invoice.create(newInvoice, {
      attributes: ['invoiceSn', 'invoiceType', 'clientId', 'counselorId', 'dueAt', 'issueAt', 'dueDateOption', 'sendEvery', 'notes', 'subject', 'tax', 'currencyId', 'total', 'amount', 'status']
      , include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['name', 'quantity', 'unitPrice', 'taxCharge', 'description']
        }]
    });

    cb(result);
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
  const dueDate = {
    0: undefined,
    1: 10,
    2: 15,
    3: 30,
    4: 60
  };
  try {

    if (!invoiceId) {
      cb({ Code: 400, Status: true, Message: '' });
      return;
    }

    invoice.dueAt = moment(invoice.issueAt).add(dueDate[invoice.dueDateOption], 'day').format();
    const foundInvoice = await db.Invoice.findOne({
      where: { 'id': invoiceId },
      include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['id', 'name', 'quantity', 'description', 'unitPrice', 'taxCharge']
        }]
    });

    if (!foundInvoice) {
      cb({ Code: 400, Status: true, Message: '' });
      return;
    }

    await foundInvoice.update(invoice, {
      attributes: ['invoiceSn', 'subject', 'tax', 'dueDateOption', 'dueAt', 'currencyId', 'notes'],
      returning: true,
      plain: true
    });

    // delete service
    const serviceIds = [];

    services.forEach( service=> {
      if(!isNaN(service.id)) serviceIds.push(parseInt(service.id));
    });

    const Op = db.Sequelize.Op;
    console.log('Service ID Array:', JSON.stringify(serviceIds));
    await db.Service.destroy({where: { id: { [Op.notIn]: serviceIds }, invoiceId}});
    console.log('Deleted');

    // update service
    await Promise.all (services.map( service => {
        if(isNaN(service.id)){
          let newService = Object.assign({}, service);
          newService.id = undefined;
          newService.invoiceId = invoiceId;
          return db.Service.create(newService, { attributes: ['name', 'quantity', 'description', 'unitPrice', 'taxCharge', 'invoiceId'] });
        }
        return db.Service.update(service, {where: {id: service.id}, attributes: ['name', 'quantity', 'description', 'unitPrice', 'taxCharge'] });
      }));

    console.log('Update or Created Service');

    const ret = await db.Invoice.findOne({
      where: { id: invoiceId },
      attributes: invoice_whiltelist,
      include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['id', 'name', 'description', 'quantity', 'unitPrice', 'taxCharge']
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
      cb({ Code: 400, Status: true, Message: 'Invalid Params' });
      return;
    }

    const foundInvoice = await db.Invoice.findOne({
      where: { 'id': invoiceId },
      include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: ['name', 'description', 'quantity', 'unitPrice', 'taxCharge']
        }]
    });

    // vaildated

    if (!foundInvoice) {
      return cb({ Code: 404, Status: true, Message: 'Invoice Not Found!' });
    }

    if (foundInvoice.status == constant.INVOICE_PAID){
      return cb({ Code: 400, Status: true, Message: 'You have no permission to delete a paid one!'});
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

  const { userInfo } = req;

  if(!userInfo) {
    return res.status(401);
  }

  try {
    // send email

    // update invoice status
    const invoice = await db.Invoice.findOne({ where: { 'id': id } })
    if (!invoice) {
      console.log('Invoie not exist in the db, invoiceId:', id);
      utils.writeErrorLog('invoice', 'send', 'Error while find invoice by id', 'Not Exist');
      cb({ Code: 400, Status: true, Message: 'Bad Request' });
      return;
    }

    const invoiceStatus = invoice.status;
    switch (invoiceStatus) {
      case constant.INVOICE_SENT:
        console.log('Already sent');
        utils.writeErrorLog('invoice', 'send', 'validate invoice status', 'Can\'t change status of invoice');
        return cb({ Code: 400, Status: true, Message: 'Already sent' });
      case constant.INVOICE_PAID:
        console.log('Can\'t change status of paid');
        utils.writeErrorLog('invoice', 'send', 'validate invoice status', 'Can\'t change status of paid invoice');
        return cb({ Code: 400, Status: true, Message: 'Already paid' });
      default:
        break;
    }

    await invoice.update({ 'status': constant.INVOICE_SENT });

    // send message to Rails via api
    await _sendMessageToRails(invoice);

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

const _sendMessageToRails = async (invoice) => {

  if(!invoice.clientId || !invoice.counselorId){
    throw Error('invoice clientId or counselorId invalid');
  }

  // get counselor Info
  const counselor = await counselorModel.findById(invoice.counselorId);

  if(!counselor || !counselor.User)
    throw Error('counselor info is invalid');
  const sender = {
    ...counselor.User.dataValues
  };

  console.log('sender =', sender);

  let accessToken = null;
  try{
    const postData = {
      "client_id": config.auth0.nodeClientId,
      "client_secret": config.auth0.nodeClientSecretKey,
      "audience": config.auth0.railsApi,
      "grant_type": "client_credentials"
    };
    const { data: { access_token: ret } } = await axios.post(`https://${config.auth0.domainRails}/oauth/token`, postData);

    console.log('Successfully received access_token token=', ret);
    accessToken = ret;

  }catch(e){
    console.log('Failed to get oauth token from rails api', e);
    throw Error('Failed to get oauth token from rails api');
  }

  try{
    if( accessToken === null ) {
      throw Error('access_token is null');
    }

    const invoiceUrl = `${config.reactUrl}/invoice/${invoice.id}`
    const msgHtml =
      `<div class="invoice-message"><main class="invoice-message__main"><div class="invoice-message__content"><div class="invoice-message__title">${sender.firstName || 'Counselor'} sent an invoice.</div><div class="invoice-message__text">Online session 08:30PM - 09:30PM</div></div><div class="invoice-message__additional"><a class="invoice-message__button invoice-message-view-button" href="${invoiceUrl}"> View Invoice </a></div></main><footer class="invoice-message__footer"><span><strong>Invoice is due on</strong> ${invoice.dueAt}</span></footer></div>`;

    const msg = {
      "counselor_id": invoice.counselorId,
      "user_id" : invoice.clientId,
      "content" : msgHtml
    };

    const resp = await axios.post(`${config.railsApiUrl}/message/`, msg, { headers: {
      'Authorization': `bearer ${accessToken}`
    }});

  }catch(e){
    console.log(e);
    throw e;
  }
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy,
  send,
  findById,
  setStatusAsPaid
}