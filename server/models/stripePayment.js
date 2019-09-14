'use strict';

var rfr = require('rfr'),
  moment = require('moment'),
  _ = require('lodash');

var config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  mailHelper = rfr('/server/shared/mailHelper'),
  utils = rfr('/server/shared/utils'),
  db = rfr('/server/db');

const whiteList = ['description', 'card', 'invoiceId',
  'customerId', 'amount', 'status', 'email',
  'sessionId', 'refundId', 'stripeConnectId'];

const create = (stripePaymentInfo) => {
  return db.StripePayment.create(stripePaymentInfo, {
    attributes: whiteList
  });
}

const findBySessionId = (sessionId) => {
  return db.StripePayment.findOne(
    {
      where: { sessionId },
      attributes: whiteList
    }
  );
}

const updateBySessionId = (sessionId, stripePaymentInfo) => {
  return db.StripePayment.update(stripePaymentInfo,
    {
      where: { sessionId },
      attributes: whiteList
    }
  );
}

module.exports = {
  create,
  findBySessionId,
  updateBySessionId
}