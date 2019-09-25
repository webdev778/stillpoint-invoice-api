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
  utils.writeInsideFunctionLog('counselor', 'index');
  db.Counselor.findAll(
    {
      attributes: ['id'],
      include: [{
        model: db.User,
        attributes: ['firstName', 'lastName'],
      },
      {
        model: db.CounselorBillSetting,
        // as: 'CounselorBillSetting',
        attributes: ['businessName', 'street', 'city', 'country', 'postCode', 'tax', 'currencyId', 'state', 'aptUnit']
      }
    ],

    }
  ).then(counselors => {
    cb(counselors);
  }).catch(err => {
    console.log(err);
    cb({Code: 500, Status: false, Message: 'model error'})
  })
}

const findById = (id) => {
  return db.Counselor.findOne(
    {
      where: {id},
      attributes: ['id'],
      include: [{
        model: db.User,
        attributes: ['firstName', 'lastName'],
      },
      {
        model: db.CounselorBillSetting
      }
     ]
    }
  );
}
module.exports = {
  index,
  findById
}