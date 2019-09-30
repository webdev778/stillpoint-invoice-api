const rfr = require('rfr');
// request = require('request');
const axios = require('axios');

const utils = rfr('/server/shared/utils');
const stripeConnectModel = rfr('/server/models/stripeConnect');
const db = rfr('/server/db');
const config = rfr('/server/shared/config');
const stripe = rfr('/server/lib/stripe/index');

const dasbhoardUrl = async (req, res) => {
  try {
    const url = await stripe.dashboardUrl();
    utils.sendResponse(res, { redirectUrl: url });
  } catch (e) {
    console.log(e);
    utils.sendResponse(res, { Code: 500, Status: false });
  }
}

const connect = async (req, res) => {
  const counselorId = req.params.counselorId;
  const { userInfo: user } = req;

  if (!user) {
    return utils.sendResponse(res, { Code: 401, Message: 'Unauthorized' });
  }

  if (counselorId !== user.counselorId + '') {
    console.log('couselorId in request is not equal to user info');
    return utils.sendResponse(res, { Code: 400, Message: 'Bad request' });
  }

  const { stripeAuthCode } = req.body;

  if (!stripeAuthCode) {
    utils.sendResponse(res, { Code: 400, Status: false });
    return;
  }

  // check current status
  try{
    const curInfo = await stripeConnectModel.findByCounselorId(counselorId);
    if(curInfo && !curInfo.revoked) {
      return utils.sendResponse(res, { Code: 400, Message: 'Bad Request' });
    }
  }catch(e){
    return utils.sendResponse(res, { Code: 500, Message: 'Internal Server Error' });
  }

  let info;
  try{
    const connectedAccountInfo = await stripe.connect(stripeAuthCode);
    console.log('connected account info', connectedAccountInfo);

    info = {
      ...connectedAccountInfo,
      counselorId,
      revoked: false
    }
  }catch(e){
    console.log(e);
    return utils.sendResponse(res, { Code: e.response.status, Status: false, Message: e.response.data.error_description });
  }

  try{
    await stripeConnectModel.updateOrCreate(info);
    utils.sendResponse(res, { Code: 200, Status: true, Message: 'Successfully Connected' });
  } catch (e) {
    return utils.sendResponse(res, { Code: 500, Message: 'Internal Server Error' });
  }
}


const disconnect = async (req, res) => {
  const counselorId = req.params.counselorId;
  const { userInfo: user } = req;

  if (!user) {
    return utils.sendResponse(res, { Code: 401, Message: 'Unauthorized' });
  }

  if (counselorId !== user.counselorId + '') {
    console.log('couselorId in request is not equal to user info', counselorId, user.counselorId);
    return utils.sendResponse(res, { Code: 400, Message: 'Bad request' });
  }

  const connectedAccount = await stripeConnectModel.findByCounselorId(counselorId);
  if (!connectedAccount) {
    utils.sendResponse(res, { Code: 400, Message: 'Bad request' });
    return;
  }

  if (connectedAccount.revoked) {
    utils.sendResponse(res, { Code: 400, Message: 'Already revoked' });
    return;
  }

  try {
    await stripe.disconnect(connectedAccount.stripeUserId);
  } catch (e) {
    console.log(e);
    const { response: { data: ret } } = e;
    if (!!ret && ret.error === 'invalid_client') {
      console.log(ret.error_description);
    }else
      return utils.sendResponse(res, { Code: 500, Message: 'Stripe Disconnect Error' });
  }

  try {
    await connectedAccount.update({ revoked: true });
    utils.sendResponse(res, { Code: 200, Status: true, Message: 'Successfully Disconnected' });
  } catch (e) {
    return utils.sendResponse(res, { Code: 500, Message: 'Internal Server Error' });
  }
}

module.exports = {
  dasbhoardUrl,
  connect,
  disconnect
}


