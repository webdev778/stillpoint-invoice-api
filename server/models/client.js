'use strict';

var rfr = require('rfr'),
moment = require('moment'),
_ = require('lodash');

var config = rfr('/server/shared/config'),
constant = rfr('/server/shared/constant'),
mailHelper = rfr('/server/shared/mailHelper'),
utils = rfr('/server/shared/utils'),
db = rfr('/server/db');

function index(req, res, cb) {
  utils.writeInsideFunctionLog('users', 'index');
  db.User.findAll(
    {
      attributes: ['id', 'firstName', 'lastName', 'timezone', 'email', 'admin', 'avatarFileName',
    'avatarContentType', 'avatarFileSize', 'wantsNewsletter', 'sentOrderForNewsletter', 'sentInstructions', 'signInCount',
    'currentSignInIp', 'currentSignInIp', 'lastSignInIp', 'slug', 'signUpReason', 'uuid', 'berlinUserId', 'signUpCityId',
    'stripeCustomerId', 'labId', 'erased', 'gender', 'dateOfBirth', 'forumAdmin', 'termsOfService', 'privacyPolicy',
    'trialDays', 'freeTrial', 'freeTrialStartDate', 'failedAttempts', 'fiscalCode', 'companiesId', 'companyId'],
      include: [{
        association: db.User.ClientContactAddress,
        as: 'clientContactAddress',
        attributes: ['country', 'city', 'street', 'postCode', 'email', 'phone', 'latitude', 'longitude']
      }]
    }
  ).then(users => {
    cb(users);
  }).catch(err => {
    console.log(err);
    cb({Code: 500, Status: false, Message: 'model error'})
  })
}

module.exports = {
  index
}

