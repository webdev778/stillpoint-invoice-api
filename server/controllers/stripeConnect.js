var rfr = require('rfr');
// request = require('request');
const axios = require('axios');

var utils = rfr('/server/shared/utils');
//stripeAccModel = rfr('/server/models/stripeAccounts');
var StripeConnect = rfr('/server/models/stripeConnect');
var db = rfr('/server/db');

const dasbhoardUrl = (req, res) => {
    utils.sendResponse(res, {
        redirectUrl: 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_Fl06oKXb0RJV0TPhRgHNhMvkCSSlBePx&scope=read_write'
    });
}

const connect = async (req, res) => {
    const counselorId = req.params.counselorId;

    if (!counselorId) {
        utils.sendResponse(res, { Code: 400, Status: false });
        return;
    }

    const stripe_auth_code = req.body.stripeAuthCode;

    if (!stripe_auth_code) {
        utils.sendResponse(res, { Code: 400, Status: false });
        return;
    }

    const fetchReqData = {
        code: stripe_auth_code,
        client_secret: 'sk_test_2yMC93yYFuP2x5C03yISPmrG00R3uHWGG4',
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

    if (!counselorId) {
        utils.sendResponse(res, { Code: 400, Status: false });
        return;
    }

    try {
        const connectedAccount = await db.StripeConnect.findOne({ where: { counselorId } });
        if (!connectedAccount) {
            utils.sendResponse(res, { Code: 400 });
            return;
        }

        if (connectedAccount.revoked) {
            utils.sendResponse(res, { Code: 400, Message: 'Already revoked' });
            return;
        }

        try{
            await axios.post('https://connect.stripe.com/oauth/deauthorize',
                {
                    client_id: 'ca_Fl06oKXb0RJV0TPhRgHNhMvkCSSlBePx',
                    stripe_user_id: connectedAccount.stripeUserId,
                },
                {
                    headers: { 'Authorization': `Bearer ${'sk_test_2yMC93yYFuP2x5C03yISPmrG00R3uHWGG4'}` }
                }
            );

            await connectedAccount.update({revoked: true});
            utils.sendResponse(res, { Code: 200, Status: true, Message: 'Successfully Disconnected' });
        }catch(e){
            throw e;
        }

    } catch (e) {
        console.log(e);
        utils.sendResponse(res, { Code: 500 });
        return;
    }
}

module.exports = {
    dasbhoardUrl,
    connect,
    disconnect
}


