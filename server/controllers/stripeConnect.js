var rfr = require('rfr');
// request = require('request');
const axios = require('axios');

var utils = rfr('/server/shared/utils');
//stripeAccModel = rfr('/server/models/stripeAccounts');
var StripeConnect = rfr('/server/models/stripeConnect');
var db = rfr('/server/db');
var config = rfr('/server/shared/config');

const crypto = require('crypto');

const generateToken = async () => {
  try {
    const buffer = await crypto.randomBytes(48);
    const token = buffer.toString('hex');
    return token;
  } catch (e) {
    console.log(e);
    throw 'Failed to generate token';
  }
}
const dasbhoardUrl = async (req, res) => {
  try {
    const token = await generateToken();
    console.log(token);
    utils.sendResponse(res, {
      redirectUrl: `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${config.stripe.clientId}&scope=read_write&state=${token}`
    });
  } catch (e) {
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

  const stripe_auth_code = req.body.stripeAuthCode;

  if (!stripe_auth_code) {
    utils.sendResponse(res, { Code: 400, Status: false });
    return;
  }

  const fetchReqData = {
    code: stripe_auth_code,
    client_secret: config.stripe.secretKey,
    grant_type: 'authorization_code'
  }

  // fetech credential from stripe
  try {
    const { data: result } = await axios.post('https://connect.stripe.com/oauth/token', fetchReqData);
    console.log(result);

    const snakeToCamel = (str) => str.replace(
      /([-_][a-z])/g,
      (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );

    let result1 = {};
    Object.keys(result).forEach(key => result1[snakeToCamel(key)] = result[key]);

    let newRecordData = Object.assign({}, result1);
    newRecordData.counselorId = counselorId;
    newRecordData.revoked = false;

    if (StripeConnect.updateOrCreate(newRecordData)) {
      utils.sendResponse(res, { Code: 200, Status: true, Message: 'Successfully Connected' });
    } else {
      utils.sendResponse(res, { Code: 500, Status: false, Message: 'Failed to connect stripe' });
    }
  } catch (e) {
    console.log(e.response.data);
    utils.sendResponse(res, { Code: e.response.status, Status: false, Message: e.response.data.error_description });
    return;
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


  const connectedAccount = await db.StripeConnect.findOne({ where: { counselorId } });
  if (!connectedAccount) {
    utils.sendResponse(res, { Code: 400, Message: 'Bad request' });
    return;
  }

  if (connectedAccount.revoked) {
    utils.sendResponse(res, { Code: 400, Message: 'Already revoked' });
    return;
  }

  try {
    await axios.post('https://connect.stripe.com/oauth/deauthorize',
      {
        client_id: config.stripe.clientId,
        stripe_user_id: connectedAccount.stripeUserId,
      },
      {
        headers: { 'Authorization': `Bearer ${config.stripe.secretKey}` }
      }
    );
  } catch (e) {
    console.log(e);
    const { response: { data: ret } } = e;
    if (!!ret && ret.error === 'invalid_client') {
      return utils.sendResponse(res, { Code: 400, Message: 'This account is not connected to stripe account' });
    }
    return utils.sendResponse(res, { Code: 500, Message: 'Stripe Connect Error' });
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


