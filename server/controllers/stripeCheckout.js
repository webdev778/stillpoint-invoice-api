var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var db = rfr('/server/db');
var invoiceModel = rfr('/server/models/invoice');
var stripePaymentModel = rfr('/server/models/stripePayment');
var constant = rfr('/server/shared/constant');
var constant = rfr('/server/shared/config');


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
      cb({ Code: 400, Status: true, Message: 'Bad Request' });
      return;
    }

    // check state
    console.log(invoice.status);
    console.log(constant['INVOICE_PAID']);
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
      cb({ Code: 400, Status: true, Message: 'Bad Request' });
      return;
    }

    const stripe = require('stripe')(stripeConnect.accessToken);

    let items = [];

    invoice.services.forEach(service => {
      let item = {
        name: service.name,
        description: service.description,  // musn't be ''
        amount: service.unitPrice,
        quantity: service.quantity,
        currency: invoice.Currency.code
      }
      items.push(item);
    })
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      client_reference_id: id,
      billing_address_collection: 'auto',  // 'auto' or 'required'
      // customer: "Test Client",
      // customer_email: "abc@gmail.com", // You may set one of customer, customer_email
      success_url: `https://stillpointspaces-invoicing.netlify.com/invoice/${id}?payment=success`,
      cancel_url: `https://stillpointspaces-invoicing.netlify.com/invoice/${id}?payment=cancel`,
    });

    // save session info
    const paymentInfo = {
      description: invoice.subject,
      invoiceId: invoice.id,
      amount: invoice.amount,
      sessionId: session.id,
      stripeConnectId: stripeConnect.id
    };
    await stripePaymentModel.create(paymentInfo);
    console.log('---save stripe checkout session info into db---');

    const ret = {
      stripeSessionId: session.id,
      stripePublishableKey: stripeConnect.stripePublishableKey
    };

    cb(ret);
  } catch (e) {
    console.log(e);
    cb({ Code: 500, Status: true, Message: 'Failed to pay invoice' });
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
  console.log(session);

  const invoiceId = session.client_reference_id;
  const sessionId = session.id;

  const paymentInfo = {
    status: constant.STRIPE_PAYMENT.TRANS_COMPLETE
  };

  // update invoice as paid
  try{
    await Promise.all([
      stripePaymentModel.updateBySessionId(sessionId, paymentInfo),
      invoiceModel.setStatusAsPaid(invoiceId)
    ]);
    console.log('successfully updated');
  }catch(e) {
    console.log(e);
  }
}

module.exports = {
  pay,
  webhook
}
