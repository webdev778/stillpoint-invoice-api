var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var db = rfr('/server/db');
var invoiceModel = rfr('/server/models/invoice');
var stripePaymentModel = rfr('/server/models/stripePayment');
var constant = rfr('/server/shared/constant');
var config = rfr('/server/shared/config');
var logger = rfr('/server/shared/logger');


const pay = async (req, res) => {
  const cb = (result) => {
    utils.sendResponse(res, result);
  }

  utils.writeInsideFunctionLog('stripeCheckout', 'pay');
  const id = req.params.id; // invoiceId

  if (!id) {
    cb({ Code: 400, Status: true, Message: 'Bad Request' });
    return;
  }

  try {
    const invoice = await invoiceModel.findById(id);

    if (!invoice) {
      console.log('invalid invoice id');
      utils.writeErrorLog('stripe_checkout', 'pay', 'Error while validating request params', 'invoice not exist', {id});
      cb({ Code: 400, Status: true, Message: `the invoice doesn't exist, id: ${id}`});
      return;
    }

    // check state
    if(invoice.status === constant['INVOICE_PAID'])
      return cb({ Code: 400, Status: true, Message: 'Already paid' });

    // Todo validate invoice if invoice client is loggedin user
    const counselorId = invoice.counselorId;
    if (!counselorId) {
      console.log('counselor invalid');
      return cb({ Code: 400, Status: true, Message: 'Bad Request' });
    }

    const stripeConnect = invoice.Counselor.StripeConnect;

    if (!stripeConnect || !stripeConnect.accessToken) {
      console.log('yet connected to stripe properly');
      utils.writeErrorLog('stripe_checkout', 'pay', 'Error while validating stripe connect status', 'yet connected to stripe properly');
      cb({ Code: 400, Status: true, Message: 'You didn\'t perform to connect stripe yet' });
      return;
    }

    const stripe = require('stripe')(stripeConnect.accessToken);

    let items = [];
    let sum = 0;
    invoice.services.forEach(service => {
      let item = {
        name: service.name,
        description: service.description || ' ',  // musn't be ''
        amount:  Math.trunc(service.unitPrice),
        quantity: service.quantity,
        currency: invoice.Currency.code
      }
      sum += service.unitPrice * service.quantity;
      items.push(item);
    })

    //add tax line
    let tax_item = {
      name: 'Tax',
      description: invoice.tax * 100 + '%',  // musn't be ''
      amount: Math.trunc(sum * invoice.tax),
      quantity: 1,
      currency: invoice.Currency.code
    }
    items.push(tax_item);

    let session;
    try{
        session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items,
        client_reference_id: id,
        billing_address_collection: 'auto',  // 'auto' or 'required'
        // customer: "Test Client",
        // customer_email: "abc@gmail.com", // You may set one of customer, customer_email
        success_url: `${config.reactUrl}/invoice/${id}?payment=success`,
        cancel_url: `${config.reactUrl}/invoice/${id}?payment=cancel`,
      });
    }catch(e){
      console.log(e);
      utils.writeErrorLog('stripe_checkout', 'pay', 'Error while creating new session of stripe checkout', e, e.message);
      return cb({ Code: 400, Status: true, Message: e.message });
    }

    // save session info
    const paymentInfo = {
      description: invoice.subject,
      invoiceId: invoice.id,
      amount: invoice.amount,
      sessionId: session.id,
      stripeConnectId: stripeConnect.id
    };
    await stripePaymentModel.create(paymentInfo);
    console.log('---saved stripe checkout session info into db---');
    logger.info('[stripeCheckout] | <pay> - saved session of stripe checkout info into db,', JSON.stringify(paymentInfo));

    const ret = {
      stripeSessionId: session.id,
      stripePublishableKey: stripeConnect.stripePublishableKey
    };

    cb(ret);
  } catch (e) {
    console.log(e);
    utils.writeErrorLog('stripe_checkout', 'pay', 'Error while stripe checkout', e, e.message)
    cb({ Code: 500, Status: true, Message: 'Failed to pay' });
  }
}

const webhook = (req, res) => {
  utils.writeInsideFunctionLog('stripeCheckout', 'webhook');
  // Set your secret key: remember to change this to your live secret key in production
  // See your keys here: https://dashboard.stripe.com/account/apikeys
  const stripe = require('stripe')(config.stripe.secretKey);

  // Find your endpoint's secret in your Dashboard's webhook settings
  const endpointSecret = config.stripe.hookKey;

  const sig = req.headers['stripe-signature'];
  console.log('sig', sig);
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(session);
    // Fulfill the purchase...
    handleCheckoutSession(session);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });

}

const handleCheckoutSession = async (session) => {
  utils.writeInsideFunctionLog('stripeCheckout', 'handleCheckoutSession');
  console.log(session);

  const invoiceId = session.client_reference_id;
  const sessionId = session.id;

  const paymentInfo = {
    status: constant.STRIPE_PAYMENT.TRANS_COMPLETE
  };

  const stripePayment = await stripePaymentModel.findBySessionId(sessionId);

  if (!stripePayment){
    return utils.writeErrorLog('stripe_checkout', 'handleCheckoutSession', 'Error while validating sessionId', 'sessionId not exist', {sessionId});
  }

  // update invoice as paid
  try{
    await Promise.all([
      stripePaymentModel.updateBySessionId(sessionId, paymentInfo),
      invoiceModel.setStatusAsPaid(invoiceId),
      _sendMessageToRails(invoice)
    ]);

    _sendMessageToRailsAPI
    console.log('successfully paid');
    logger.info('[stripeCheckout] | <handleCheckoutSession> - successfully paid and updated invoice and payement data in the db,', JSON.stringify(session));
  }catch(e) {
    console.log(e);
  }
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
  pay,
  webhook
}
