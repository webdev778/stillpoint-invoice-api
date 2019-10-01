const rfr = require('rfr');

const utils = rfr('/server/shared/utils');
const db = rfr('/server/db');
const invoiceModel = rfr('/server/models/invoice');
const stripePaymentModel = rfr('/server/models/stripePayment');
const constant = rfr('/server/shared/constant');
const config = rfr('/server/shared/config');
const logger = rfr('/server/shared/logger');
const moment = require('moment');
const railsApi = rfr('/server/lib/railsapi');


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
    if(tax_item.amount > 0)
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
      console.log(items);
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

const webhook = async (req, res) => {
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
    const { sequelize } = db;
    try{
      await sequelize.transaction(async (t1) => {
        await handleCheckoutSession(session);
      });
    }catch(e){
      console.log(e);
      return res.status(500).send(`Webhook Error: ${e.message}`);
    }
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
  await Promise.all([
    stripePaymentModel.updateBySessionId(sessionId, paymentInfo),
    invoiceModel.setStatusAsPaid(invoiceId)
  ]);


  const invoice = await invoiceModel.findById(invoiceId);
  if(!invoice) {
    return utils.writeErrorLog('stripe_checkout', 'handleCheckoutSession', 'Error while getting invoice', 'invoice with id not exist', {invoiceId});
  }

  if(invoice.status != constant.INVOICE_PAID){
    return utils.writeErrorLog('stripe_checkout', 'handleCheckoutSession', 'Error while validate invoice status', 'invalid status', {invoiceId});
  }

  await railsApi.sendMessage(invoice)
  logger.info('[stripeCheckout] | <handleCheckoutSession> - successfully paid and updated invoice and payement data in the db,', JSON.stringify(session));
}

module.exports = {
  pay,
  webhook
}
