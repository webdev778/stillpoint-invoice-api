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

  const { userInfo: user} = req;

  if(!user || !user.isCounsellor) {
    return cb({Code: 401, Message: 'Unauthorized'});
  }



  utils.writeInsideFunctionLog('users', 'index');
  db.User.findAll(
    {
      where: { id: { [db.Sequelize.Op.in]: [db.Sequelize.literal(`select distinct(client_id) from session_invitations where counselor_id = ${user.counselorId} and accepted_at is not null`)]}},
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
    include: [{
      model: db.Counselor,
      include: {
        model: db.StripeConnect,
        where: { revoked: false },
        required: false
      }
    }, {
      model: db.ClientContactAddress
    }]
  })
}

module.exports = {
  index,
  findById
}

