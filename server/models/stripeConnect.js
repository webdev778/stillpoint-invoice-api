'use strict';

const rfr = require('rfr'),
  moment = require('moment'),
  _ = require('lodash');

const config = rfr('/server/shared/config'),
  constant = rfr('/server/shared/constant'),
  mailHelper = rfr('/server/shared/mailHelper'),
  utils = rfr('/server/shared/utils'),
  db = rfr('/server/db');

const attributesToShow = ['counselorId', 'accessToken', 'refreshToken',
                'stripePublishableKey', 'stripeUserId', 'scope', 'revoked'];

const attributesToEdit = ['accessToken', 'refreshToken', 'stripePublishableKey',
                'stripeUserId', 'scope', 'revoked'];

const create = (stripeConnectInfo) => {
  utils.writeInsideFunctionLog('stripe_connects', 'create');

  return db.StripeConnect.create(stripeConnectInfo, {
      attributes: attributesToShow
  });
}

const updateByCounselorId = (counselorId, stripeConnectInfo) => {
  utils.writeInsideFunctionLog('stripe_connects', 'update');

  return db.StripeConnect.update(stripeConnectInfo, {
      where: { counselorId },
      attributes: attributesToEdit
  });
}

const updateOrCreate = async (stripeConnectInfo) => {
  utils.writeInsideFunctionLog('stripe_connects', 'updateOrCreate');

  const counselorId = stripeConnectInfo.counselorId;

  const record = await findByCounselorId(counselorId);

  if(!!record){
    await updateByCounselorId(counselorId, stripeConnectInfo);
  }else{
    await create(stripeConnectInfo);
  }
}

const findByCounselorId = (counselorId) => {
  return db.StripeConnect.findOne({
    where: {counselorId}
  });
}

module.exports = {
  create,
  updateByCounselorId,
  updateOrCreate,
  findByCounselorId
}