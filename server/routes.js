var rfr = require('rfr');

var categoryCtlr = rfr('/server/controllers/static/categories'),
degreeCtlr = rfr('/server/controllers/static/degrees'),
employmentTypeCtlr = rfr('/server/controllers/static/employmentTypes'),
practiceAreaCtlr = rfr('/server/controllers/static/practiceAreas'),
skillCtlr = rfr('/server/controllers/static/skills'),
stateCtlr = rfr('/server/controllers/static/states'),
workLocationCtlr = rfr('/server/controllers/static/workLocations'),
serviceChargeCtlr = rfr('/server/controllers/static/serviceCharge');

var universalCtlr = rfr('/server/controllers/universal'),
userCtlr = rfr('/server/controllers/users'),
postJobCtlr = rfr('/server/controllers/postJobs'),
adminCtlr = rfr('/server/controllers/admin'),
savedJobsCtlr = rfr('/server/controllers/savedJobs'),
jobStatusCtlr = rfr('/server/controllers/jobStatus'),
negotiateTermsCtlr = rfr('/server/controllers/negotiateTerms'),
stripeAccCtlr = rfr('/server/controllers/stripeAccounts'),
wNineInfoCtrl = rfr('/server/controllers/wNineInfo'),

invoiceCtrl = rfr('/server/controllers/invoices'),
serviceCtrl = rfr('/server/controllers/services'),
counselorBillSettingCtrl = rfr('/server/controllers/counselorBillSettings'),
clientCtrl = rfr('/server/controllers/clients'),
currencyCtrl = rfr('/server/controllers/currencies'),
counselorCtrl = rfr('/server/controllers/counselors');

var getHandler = {},
postHandler = {}

// All get services
getHandler['/invoices'] = invoiceCtrl.index;
getHandler['/services'] = serviceCtrl.index;
getHandler['/invoice/setting/:counselorId'] = counselorBillSettingCtrl.index;
getHandler['/clients'] = clientCtrl.index;
getHandler['/counselors'] = counselorCtrl.index;
getHandler['/currencies'] = currencyCtrl.index;

// All post services
postHandler['/login'] = userCtlr.login;
postHandler['/signup'] = userCtlr.signup;
postHandler['/forgotPassword'] = userCtlr.forgotPassword;
postHandler['/checkResetLink/:secretId'] = userCtlr.checkResetLink;
postHandler['/resetPassword/:secretId'] = userCtlr.resetPassword;
postHandler['/changePassword'] = userCtlr.changePassword;
postHandler['/logout'] = userCtlr.logout;

postHandler['/getReleaseFundUrl'] = stripeAccCtlr.getReleaseFundUrl;
postHandler['/getCreateStripeAccountLink'] = stripeAccCtlr.getCreateStripeAccountLink;
postHandler['/setStripeAccountInfo'] = stripeAccCtlr.setStripeAccountInfo;
postHandler['/getStripeDashboardLink'] = stripeAccCtlr.getStripeDashboardLink;
postHandler['/transferFunds'] = stripeAccCtlr.transferFunds;
postHandler['/realeaseFund'] = stripeAccCtlr.realeaseFund;

postHandler['/setWNineInfo'] = wNineInfoCtrl.setAndUpdate;

postHandler['/webhook'] = stripeAccCtlr.webhook;

postHandler['/invoice'] = invoiceCtrl.create;
postHandler['/service'] = serviceCtrl.create;
postHandler['/invoice/setting'] = counselorBillSettingCtrl.create;
function _bindAllGetRequests(app) {
  for (var key in getHandler) {
    app.get(key, getHandler[key]);
  }
}

function _bindAllPostRequests(app) {
  for (var key in postHandler) {
    app.post(key, postHandler[key]);
  }
}

function bindAllRequests(app) {
  _bindAllGetRequests(app);
  _bindAllPostRequests(app);
}

module.exports.bindAllRequests = bindAllRequests;
