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
  utils.writeInsideFunctionLog('counselor_bill_settings', 'index');
  db.CounselorBillSetting.findOne({ where: {'counselorId': req.params.counselorId} }).then(counselor_bill_settings => {
    if (counselor_bill_settings)
    {
      cb(counselor_bill_settings);
    }
    else{
      cb({Code: 500, Status: false, Message: 'no data'})
    }
  }).catch(err => {
    cb({Code: 500, Status: false, Message: 'model error'})
  })
}


const updateorcreate = async (req, res, cb) => {
  // First try to find the record
  const counselorId =  req.body.counselorId;  

  db.CounselorBillSetting.findOne({ where: {'counselorId': counselorId } }).then(foundItem=> {
      
      if (!foundItem) {
          // Item not found, create a new one
          const counselor_bill_setting = req.body;
            try{
              const result =db.CounselorBillSetting.create(counselor_bill_setting);
              cb({Code: 200, Status: true, Message: result});
            }catch(e){
              cb({Code: 500, Status: true, Message: 'Failed to create service'});
            }
      } else {
          // Found an item, update it
            const counselor_bill_setting = req.body;
            
            try{
              const result =db.CounselorBillSetting.update(
                req.body,
                 { where: { 'counselorId': counselorId }, attributes: ['businessName', 'street', 'city', 'currencyId', 'country', 'postCode', 'state', 'aptUnit', 'tax' ] }
                ).then(updatedMax => {
                  console.log(updatedMax)
                });
              cb({Code: 200, Status: true, Message: result});
            }catch(e){
              cb({Code: 500, Status: true, Message: 'Failed to create service'});
            }
      }
  })
}

module.exports = {
  index,
  updateorcreate
}