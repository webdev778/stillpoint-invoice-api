var rfr = require('rfr');

var invoiceCtrl = rfr('/server/controllers/invoices'),
serviceCtrl = rfr('/server/controllers/services'),
counselorBillSettingCtrl = rfr('/server/controllers/counselorBillSettings'),
clientCtrl = rfr('/server/controllers/clients'),
currencyCtrl = rfr('/server/controllers/currencies'),
counselorCtrl = rfr('/server/controllers/counselors'),
stripeConnectCtrl = rfr('/server/controllers/stripeConnect'),
stripeCheckoutCtrl = rfr('/server/controllers/stripeCheckout'),
authCtrl = rfr('/server/controllers/auth');

var _get  = {},
    _post = {},
    _put  = {},
    _del  = {};

/**************************************************************************
 * Invoice Management Platform
 *
 ***************************************************************************/

// auth api
_get['/ping'] = authCtrl.ping;
_post['/user/'] = authCtrl.login;
// _get['/login'] = authCtrl.auth;

// basic data api
_get['/currencies'] = currencyCtrl.index;

// client api
_get['/clients'] = clientCtrl.index;

// counselr api
_get['/counselors'] = counselorCtrl.index;


// invoice api
_get['/invoice/types'] = invoiceCtrl.type;
_get['/invoice/status'] = invoiceCtrl.status;
_get['/invoices'] = invoiceCtrl.index;
_post['/invoice/new'] = invoiceCtrl.newInvoice;
_get['/invoice/:id'] = invoiceCtrl.show;
_post['/invoice'] = invoiceCtrl.create;
_put['/invoice/:invoiceId'] = invoiceCtrl.update;
_del['/invoice/:invoiceId'] = invoiceCtrl.destroy;
_post['/invoice/:id/send'] = invoiceCtrl.send;
_post['/invoice/:id/pay'] = stripeCheckoutCtrl.pay;
_post['/invoice/:id/off_pay'] = invoiceCtrl.offpay;
_post['/invoice/:id/void'] = invoiceCtrl.void;

// invoice setting api
_get['/invoice/setting/:counselorId'] = counselorBillSettingCtrl.show;
_post['/invoice/setting'] = counselorBillSettingCtrl.create;

// service api
_get['/services'] = serviceCtrl.index;
_post['/service'] = serviceCtrl.create;

// stripe connect api
_post['/stripe/dashboard_url'] = stripeConnectCtrl.dasbhoardUrl;
_post['/stripe/connect/:counselorId'] = stripeConnectCtrl.connect;
 _put['/stripe/disconnect/:counselorId'] = stripeConnectCtrl.disconnect;

// stripe checkout
_post['/stripe/webhook'] = stripeCheckoutCtrl.webhook;

const asyncHandler = fn => (req, res, next) =>
Promise
  .resolve(fn(req, res, next))
  .catch(next);

function _bindAllGetRequests(app) {
  for (var key in _get) {
    app.get(key, asyncHandler(_get[key]));
  }
}

function _bindAllPostRequests(app) {
  for (var key in _post) {
    app.post(key, asyncHandler(_post[key]));
  }
}

function _bindAllPutRequests(app) {
  for (var key in _put) {
    app.put(key, asyncHandler(_put[key]));
  }
}

function _bindAllDeleteRequests(app) {
  for (var key in _del) {
    app.delete(key, asyncHandler(_del[key]));
  }
}

function bindAllRequests(app) {
  _bindAllGetRequests(app);
  _bindAllPostRequests(app);
  _bindAllPutRequests(app);
  _bindAllDeleteRequests(app);
}

module.exports.bindAllRequests = bindAllRequests;
