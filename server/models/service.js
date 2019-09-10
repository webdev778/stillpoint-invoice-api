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
  utils.writeInsideFunctionLog('services', 'index');
  // cb({Code: 200, Status: true, Message: 'services/index'});
  db.Invoice.findAll().then(services => {
    cb(services);
  }).catch(err => {
    cb({Code: 500, Status: false, Message: 'model error'})
  })
}

const create = async (req, res, cb) => {
  utils.writeInsideFunctionLog('services', 'create');

  const service = req.body;
  try{
    console.log(service);
    const result = await db.Service.create(service
      );
    cb({Code: 200, Status: true, Message: result});
  }catch(e){
    console.log(e);
    cb({Code: 500, Status: true, Message: 'Failed to create service'});
  }
}

module.exports = {
  index,
  create
}