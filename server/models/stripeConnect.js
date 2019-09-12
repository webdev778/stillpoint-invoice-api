'use strict';

var rfr = require('rfr'),
  moment = require('moment'),
  _ = require('lodash');

var config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  mailHelper = rfr('/server/shared/mailHelper'),
  utils = rfr('/server/shared/utils'),
  db = rfr('/server/db');

const whiteList = ['counselorId', 'accessToken', 'refreshToken',
                'stripePublishableKey', 'stripeUserId', 'scope'];

const create = async (stripeConnectInfo) => {
  utils.writeInsideFunctionLog('stripe_connects', 'create');

  try {
    const result = await db.StripeConnect.create(stripeConnectInfo, {
      attributes: whiteList
    });

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

const updateOrCreate = async (stripeConnectInfo) => {
  utils.writeInsideFunctionLog('stripe_connects', 'updateOrCreate');

  const counselorId = stripeConnectInfo.counselorId;

  if(!counselorId) {
    console.log('counselorId is empty');
    return false;
  }

  try {
    const record = await db.StripeConnect.findOne({where: {counselorId}});

    if(!!record){
      const result = await record.update(stripeConnectInfo, {
        attributes: whiteList
      });
    }else{
      const result = await db.StripeConnect.create(stripeConnectInfo, {
        attributes: whiteList
      });
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

module.exports = {
  create,
  updateOrCreate
}