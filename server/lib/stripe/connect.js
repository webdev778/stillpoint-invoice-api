const axios = require('axios');
const moment = require('moment');
const rfr = require('rfr');
const config = rfr('/server/shared/config');
const constant = rfr('/server/shared/constant');
const utils = rfr('/server/shared/constant');
const crypto = require('crypto');

const STRIPE_CONNECT_URL = 'https://connect.stripe.com/oauth/token';
const STRIPE_DISCONNECT_URL = 'https://connect.stripe.com/oauth/deauthorize';
const STRIPE_DASHBOARD_URL = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${config.stripe.clientId}&scope=read_write&state=`;

const stateToken = async () => {
  try {
    const buffer = await crypto.randomBytes(48);
    const token = buffer.toString('hex');
    return token;
  } catch (e) {
    throw new Error('Failed to generate token');
  }
}

const dashboardUrl = async () => {
  const token = await stateToken();
  return STRIPE_DASHBOARD_URL + token;
}

const connect = async (authCode) => {
  const req = {
    code: authCode,
    client_secret: config.stripe.secretKey,
    grant_type: 'authorization_code'
  }

  // fetech keys of the connected account from stripe.com
  try {
    const { data: result } = await axios.post(STRIPE_CONNECT_URL, req);

    // Object.keys(result).forEach(key => ret[utils.snakeToCamel(key)] = result[key]);
    const ret = {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      stripePublishableKey: result.stripe_publishable_key,
      stripeUserId: result.stripe_user_id,
      scope: result.scope,
    };

    return ret;

  } catch (e) {
    console.log(e.response.data);
    throw e;
  }
}

const disconnect = (stripeUserId) => {
  const req = {
    client_id: config.stripe.clientId,
    stripe_user_id: stripeUserId,
  };

  return axios.post(STRIPE_DISCONNECT_URL, req,
    { headers: { 'Authorization': `Bearer ${config.stripe.secretKey}` } }
  );
}

module.exports = {
  dashboardUrl,
  connect,
  disconnect
}
