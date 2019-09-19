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
      attributes: ['id', 'firstName', 'lastName'],
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

const findById = (id) => {
  return db.User.findOne({
    where: { id },
    include: {
      model: db.Counselor,
      include: {
        model: db.StripeConnect,
        where: { revoked: false }
      }
    }
  })
}

module.exports = {
  index,
  findById
}

