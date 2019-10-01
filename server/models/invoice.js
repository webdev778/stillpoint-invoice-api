'use strict';

const rfr = require('rfr'),
  moment = require('moment'),
  _ = require('lodash');
const axios = require('axios');


const config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  mailHelper = rfr('/server/shared/mailHelper'),
  utils = rfr('/server/shared/utils'),
  logger = rfr('/server/shared/logger'),
  db = rfr('/server/db');

const counselorModel = rfr('/server/models/counselor');
const clientModel = rfr('/server/models/client');
const railsApi = rfr('/server/lib/railsapi');


const attributesToShow = ['id', 'invoiceSn', 'invoiceType', 'clientId', 'counselorId',
  'sendEvery', 'subject', 'tax', 'currencyId', 'senderName', 'senderStreet', 'senderCity', 'senderPostCode',
  'senderCountry', 'recipientName', 'recipientStreet', 'recipientCity', 'recipientPostCode', 'recipientCountry', 'total', 'amount', 'paidAmount', 'notes',
  'dueDateOption', 'status', 'issueAt', 'dueAt', 'viewedAt', 'sentAt', 'paidAt', 'createdAt', 'manualSent', 'manualPaid', 'senderAddress'];

const attributesToEdit = ['invoiceSn', 'invoiceType', 'clientId', 'counselorId',
  'sendEvery', 'subject', 'tax', 'currencyId', 'senderName', 'senderStreet', 'senderCity', 'senderPostCode',
  'senderCountry', 'recipientName', 'recipientStreet', 'recipientCity', 'recipientPostCode', 'recipientCountry', 'total', 'amount', 'paidAmount', 'notes',
  'dueDateOption', 'issueAt', 'dueAt', 'senderAddress'];

const attributesServiceToShow = ['id', 'name', 'description', 'quantity', 'unitPrice', 'taxCharge'];
const attributesServiceToEdit = ['name', 'quantity', 'unitPrice', 'taxCharge', 'description'];


const dueDate = {
  0: 'Upon Receipt',
  1: 7,
  2: 14,
  3: 30
};

const validateCreateRequest = (req) => {


  if(!req.issueAt) throw 'issueAt is invalid';
  if( (req.invoiceType !== 0 && !req.invoiceType) || req.invoiceType === undefined) throw Error('invoice type is invalid');

  switch (req.invoiceType){
    case constant.INVOICE_INDIVIDUAL:
        if(req.dueDateOption>3) throw Error('dueDateOption is invalid');
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
    attributes: [...attributesToShow,
      [db.sequelize.literal(
        'EXISTS(select 1 from stripe_connects where stripe_connects.counselor_id = "Invoice".counselor_id and stripe_connects.revoked = false)'),
        'onlinePayable']
      ],
    include: [{
      association: db.Invoice.Services,
      as: 'services',
      attributes: attributesServiceToShow
    }]
  }).then(invoices => {
    cb(invoices);
  }).catch(err => {
    console.log(err);
    utils.writeErrorLog('invoices', 'index', 'Error while findAll invoices', err);
    cb({ Code: 500, Status: false, Message: 'model error' })
  })
}

const show = async (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'show');

  const id = req.params.id;

  const { userInfo } = req;

  if(!userInfo) return cb({Code:401});

  let condition = undefined;

  if(userInfo.isCounsellor)
    condition = { counselorId: userInfo.counselorId };
  else
    condition = { clientId: userInfo.id };

  try{
    const invoice = await db.Invoice.findOne({
      where: { id, ...condition },
      attributes: [...attributesToShow,
        [db.sequelize.literal(
          'EXISTS(select 1 from stripe_connects where stripe_connects.counselor_id = "Invoice".counselor_id and stripe_connects.revoked = false)'),
          'onlinePayable']
        ],
      include: [{
        association: db.Invoice.Services,
        as: 'services',
        attributes: attributesServiceToShow
      }]
    });

    if(!userInfo.isCounsellor && invoice.clientId === userInfo.id){
      // update viewedAt & dueAt
      const updatedInvoice = await invoice.update({viewedAt: db.Sequelize.literal('CURRENT_TIMESTAMP'),
        dueAt: !invoice.dueDateOption ? db.Sequelize.literal(`CURRENT_TIMESTAMP + INTERVAL '1 DAY'`) : undefined });
      cb(updatedInvoice);
    }else{
      cb(invoice);
    }
  }catch(err){
    console.log(err);
    utils.writeErrorLog('invoices', 'show', 'Error while find invoice ', err);
    cb({ Code: 500, Status: false, Message: 'model error' })
  }
}

const create = async (req, res, cb) => {
  utils.writeInsideFunctionLog('invoices', 'create');

  const { userInfo } = req;

  if(!userInfo) {
    cb({ Code: 401, Message: 'Unauthorized' });
    return;
  }

  try {
    const newInvoice = Object.assign({}, req.body);
    const { invoiceType: type } = newInvoice;

    // validate request
    try {
      validateCreateRequest(req.body);
    }catch(e){
      console.log('validate error', e);
      return cb({Code: 400, Status: true, Message: e.message});
    }

    if(type === constant.INVOICE_INDIVIDUAL) {
      if(newInvoice.dueDateOption !== 0)
        newInvoice.dueAt = moment.utc(newInvoice.issueAt).add(dueDate[newInvoice.dueDateOption], 'day');
    }

    // get address info of counselor and client
    await _updateAddress(newInvoice, newInvoice.counselorId, newInvoice.clientId);

    const result = await db.Invoice.create(newInvoice, {
      attributes: attributesToEdit,
      include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: attributesServiceToEdit
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

  try {

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
      cb({ Code: 404, Status: true, Message: 'Invoice Not Found' });
      return;
    }

    const type = foundInvoice.invoiceType;
    if(type === constant.INVOICE_INDIVIDUAL) {
      if(invoice.dueDateOption !== 0){
        invoice.dueAt = moment(foundInvoice.issueAt).add(dueDate[invoice.dueDateOption], 'day');
      }else{
        invoice.dueAt = db.Sequelize.literal('NULL');
        // invoice.dueAt = db.Sequelize.literal(`issue_at + INTERVAL '${dueDate[invoice.dueDateOption]} DAY'`);
      }
    }

    // update address
    await _updateAddress(invoice, foundInvoice.counselorId, foundInvoice.clientId);

    await foundInvoice.update(invoice, {
      attributes: attributesToEdit,
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
      attributes: attributesToShow,
      include: [
        {
          association: db.Invoice.Services,
          as: 'services',
          attributes: attributesServiceToShow
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
          attributes: attributesServiceToShow
        }]
    });

    // vaildated

    if (!foundInvoice) {
      return cb({ Code: 404, Status: true, Message: 'Invoice Not Found!' });
    }

    const services = foundInvoice.services;
    await Promise.all(services.map(service => {
      return service.destroy();
    }));

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
    return utils.sendResponse(res, {Code: 401, Message: 'Unauthorized'});
  }

  const { sequelize: seq } = db;
  let transaction = null;

  try {
    // send email

    // update invoice status
    const invoice = await findById(id);
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


    transaction = await seq.transaction();
    await invoice.update(
      {
        'status': constant.INVOICE_SENT,
        sentAt: db.Sequelize.literal('CURRENT_TIMESTAMP')
      },
      { transaction }
    );

    // send message to Rails via api
    await railsApi.sendMessage(invoice);

    await transaction.commit();
    cb({ Code: 200, Status: true, Message: 'Sent Successfully' });
  } catch (e) {
    console.log(e);
    if(transaction)
      await transaction.rollback();
    cb({ Code: 500, Status: true, Message: 'Failed to send invoice' });
  }
}

const findById = (id) => {
  return db.Invoice.findOne({
    where: { id },
    include: [
      {
        model: db.Counselor,
        include: [db.StripeConnect, db.User]
      },
      {
        association: db.Invoice.Services,
        as: 'services',
      },
      db.Currency]
  });
}

const all = () => {
  return db.Invoice.findAll({
    limit: 5,
    raw: true
  });
}

const setStatusAsPaid = (id) => {
  return db.Invoice.update(
    { status: 2,
      paidAt: db.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    {
      where: { id }
    });
}

const getNewInvoiceSn = (counselorId, clientId) => {
  return db.sequelize.query(
    `SELECT coalesce(max(CASE WHEN invoice_sn~E'^\\\\d+$' THEN CAST (invoice_sn AS INTEGER) ELSE 0 end), 0)+1 as "nextSn" FROM new_invoices where counselor_id=${counselorId}`,
    { type: db.sequelize.QueryTypes.SELECT }
  );
}

const markAsPaid = (id) => {
  return db.Invoice.update(
    {
      status: constant.INVOICE_PAID,
      paidAt: db.Sequelize.literal('CURRENT_TIMESTAMP')
      //,manualPaid: true
    },
    {
      where: { id },
      returning: true,
      plain: true
    });
}

const markAsVoid = (id) => {
  return db.Invoice.update(
    {
      status: constant.INVOICE_VOID
    },
    {
      where: { id },
      returning: true,
      plain: true
    });
}

const _updateAddress = async (payload, counselorId, clientId) => {
  const client = await clientModel.findById(clientId);
  const counselor = await counselorModel.findById(counselorId);


  if(!client) {
    utils.writeErrorLog('invoice', 'create', 'Error while getting client info', 'Invalid clientId', {clientId});
    throw Error('clientId is invalid, not exist in db');
  }

  if(!counselor){
    utils.writeErrorLog('invoice', 'create', 'Error while getting counselor info', 'Invalid counselorId', {counselorId});
    throw Error('counselorId is invalid, not exist in db');
  }

  const clientAddressInfo = client.ClientContactAddress;
  const counselorAddressInfo = counselor.CounselorBillSetting;
  // newInvoice.senderName = userInfo.firstName + ' ' + userInfo.lastName;
  payload.recipientName = client.firstName + ' ' + client.lastName;

  if(clientAddressInfo){
    payload.recipientStreet = clientAddressInfo.street;
    payload.recipientCity = clientAddressInfo.city;
    payload.recipientPostCode = clientAddressInfo.postCode;
    payload.recipientCountry = clientAddressInfo.country;
  }

  if(counselorAddressInfo){
    payload.senderName = counselorAddressInfo.businessName;
    payload.senderAddress = counselorAddressInfo.address;
    payload.senderStreet = counselorAddressInfo.street;
    if(!!counselorAddressInfo.state)
      payload.senderCity =  counselorAddressInfo.city + ', ' + counselorAddressInfo.state;
    else
      payload.senderCity =  counselorAddressInfo.city
    payload.senderPostCode = counselorAddressInfo.postCode;
    payload.senderCountry = counselorAddressInfo.country;
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
  setStatusAsPaid,
  all,
  getNewInvoiceSn,
  markAsPaid,
  markAsVoid
}