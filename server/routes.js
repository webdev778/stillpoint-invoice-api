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
counselorCtrl = rfr('/server/controllers/counselors'),
stripeConnectCtrl = rfr('/server/controllers/stripeConnect'),
stripeCheckoutCtrl = rfr('/server/controllers/stripeCheckout'),
authCtrl = rfr('/server/controllers/auth');

var getHandler = {},
postHandler = {},
putHandler = {},
deleteHandler = {};

// All get services
getHandler['/getCategories'] = categoryCtlr.get;
getHandler['/getDegrees'] = degreeCtlr.get;
getHandler['/getEmploymentTypes'] = employmentTypeCtlr.get;
getHandler['/getPracticeAreas'] = practiceAreaCtlr.get;
getHandler['/getStates'] = stateCtlr.get;
getHandler['/getSkills'] = skillCtlr.get;
getHandler['/getWorkLocations'] = workLocationCtlr.get;
getHandler['/getServiceCharge'] = serviceChargeCtlr.get;

getHandler['/getUserProfile/:forUser/:fromUser/:userId?'] = userCtlr.getUserProfile;
getHandler['/resendEmail/:email'] = userCtlr.resendEmail;
getHandler['/verifyEmail/:secretId'] = userCtlr.verifyEmail;
getHandler['/getCandidatesData'] = userCtlr.getCandidatesData;

getHandler['/getPostJob/:jobId'] = postJobCtlr.getPostJobData;

getHandler['/exportUsers'] = adminCtlr.exportUsers;
getHandler['/exportPostJobs'] = adminCtlr.exportPostJobs;

getHandler['/getAllLists'] = universalCtlr.getAllListsData;
getHandler['/getLogFile/:token/:fileName'] = universalCtlr.getLogFile;

getHandler['/getPostJobDetails/:jobId/:userRole?'] = postJobCtlr.getPostJobDetails;
getHandler['/getPostJobByUserId/:page'] = postJobCtlr.getPostJobByUserId;

getHandler['/getSavedJobs/:page'] = savedJobsCtlr.get;
getHandler['/getAppliedJobs/:page'] = jobStatusCtlr.getAll;

// All post services
postHandler['/login'] = userCtlr.login;
postHandler['/signup'] = userCtlr.signup;
postHandler['/forgotPassword'] = userCtlr.forgotPassword;
postHandler['/checkResetLink/:secretId'] = userCtlr.checkResetLink;
postHandler['/resetPassword/:secretId'] = userCtlr.resetPassword;
postHandler['/changePassword'] = userCtlr.changePassword;
postHandler['/logout'] = userCtlr.logout;

postHandler['/userBasicProfile'] = userCtlr.basicProfile;
postHandler['/userExperienceProfile'] = userCtlr.experienceProfile;
postHandler['/userNetworkProfile'] = userCtlr.networkProfile;
postHandler['/userJobProfile'] = userCtlr.jobProfile;
postHandler['/posterBasicProfile'] = userCtlr.posterBasicProfile;

postHandler['/postJob'] = postJobCtlr.postJobData;
postHandler['/updatePostedJobStatus'] = postJobCtlr.updatePostedJobStatus;
postHandler['/getStepData'] = postJobCtlr.getStepData;
postHandler['/getPostJobs/:page'] = postJobCtlr.getAll;

postHandler['/updateSavedJob'] = savedJobsCtlr.updateSavedJob;
postHandler['/updateJobStatus'] = jobStatusCtlr.updateJobStatus;
postHandler['/saveRating'] = jobStatusCtlr.saveRating;

postHandler['/updateNegotiateTerms'] = negotiateTermsCtlr.update;
postHandler['/updateDeliverableStatus'] = negotiateTermsCtlr.updateDeliverableStatus;
postHandler['/updateHourlyFixedTerms'] = negotiateTermsCtlr.updateHourlyFixedTerms;
postHandler['/downloadDeliverableFile'] = negotiateTermsCtlr.downloadDeliverableFile;

postHandler['/getReleaseFundUrl'] = stripeAccCtlr.getReleaseFundUrl;
postHandler['/getCreateStripeAccountLink'] = stripeAccCtlr.getCreateStripeAccountLink;
postHandler['/setStripeAccountInfo'] = stripeAccCtlr.setStripeAccountInfo;
postHandler['/getStripeDashboardLink'] = stripeAccCtlr.getStripeDashboardLink;
postHandler['/transferFunds'] = stripeAccCtlr.transferFunds;
postHandler['/realeaseFund'] = stripeAccCtlr.realeaseFund;

postHandler['/setWNineInfo'] = wNineInfoCtrl.setAndUpdate;

postHandler['/contactus'] = universalCtlr.contactUs;
postHandler['/sendMessage'] = universalCtlr.sendMsg;

postHandler['/webhook'] = stripeAccCtlr.webhook;

// All get services

getHandler['/services'] = serviceCtrl.index;
getHandler['/clients'] = clientCtrl.index;
getHandler['/counselors'] = counselorCtrl.index;
getHandler['/currencies'] = currencyCtrl.index;

getHandler['/invoice/setting/:counselorId'] = counselorBillSettingCtrl.index;
getHandler['/invoices'] = invoiceCtrl.index;
getHandler['/invoice'] = currencyCtrl.index;
getHandler['/invoice/types'] = invoiceCtrl.type;
getHandler['/invoice/status'] = invoiceCtrl.status;

// All post services
postHandler['/invoice'] = invoiceCtrl.create;
postHandler['/service'] = serviceCtrl.create;
postHandler['/invoice/setting'] = counselorBillSettingCtrl.create;
postHandler['/invoice/:id/send'] = invoiceCtrl.send;
postHandler['/invoice/:id/pay'] = stripeCheckoutCtrl.pay;

postHandler['/stripe/dashboard_url'] = stripeConnectCtrl.dasbhoardUrl;
postHandler['/stripe/connect/:counselorId'] = stripeConnectCtrl.connect;
postHandler['/user'] = authCtrl.login;
postHandler['/stripe/webhook'] = stripeCheckoutCtrl.webhook;

putHandler['/invoice/:invoiceId'] = invoiceCtrl.update;
putHandler['/stripe/disconnect/:counselorId'] = stripeConnectCtrl.disconnect;

deleteHandler['/invoice/:invoiceId'] = invoiceCtrl.destroy;

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

function _bindAllPutRequests(app) {
  for (var key in putHandler) {
    app.put(key, putHandler[key]);
  }
}

function _bindAllDeleteRequests(app) {
  for (var key in deleteHandler) {
    app.delete(key, deleteHandler[key]);
  }
}

function bindAllRequests(app) {
  _bindAllGetRequests(app);
  _bindAllPostRequests(app);
  _bindAllPutRequests(app);
  _bindAllDeleteRequests(app);
}

module.exports.bindAllRequests = bindAllRequests;
