"use strict";

var rfr = require("rfr"),
  moment = require("moment"),
  _ = require("lodash");

var config = rfr("/server/shared/config"),
  constant = rfr("/server/shared/constant"),
  mailHelper = rfr("/server/shared/mailHelper"),
  utils = rfr("/server/shared/utils"),
  db = rfr("/server/db");

const attributesToShow = ['id', 'businessName', 'street', 'city', 'country', 'postCode', 'tax',
                        'currencyId', 'state', 'aptUnit', 'counselorId', 'address'];
const attributesToEdit = ['businessName', 'street', 'city', 'country', 'postCode', 'tax',
                        'currencyId', 'state', 'aptUnit', 'counselorId', 'address'];

const show = async (req, res, cb) => {
  utils.writeInsideFunctionLog("counselor_bill_settings", "show");
  const counselorId = req.params.counselorId;

  const { userInfo: user } = req;
  if(!user || !user.isCounsellor || user.counselorId != counselorId)
    return cb({Code:401, Message: 'Unauthorized'});

  try{
    const setting = await db.CounselorBillSetting.findOne({
      where: { counselorId: req.params.counselorId },
      attributes: attributesToShow
    });

    if (setting) {
      cb(setting);
    } else {
      const emptySetting = {
        "businessName": user.firstName+' '+user.lastName,
        "street": "",
        "city": "",
        "country": "",
        "postCode": "",
        "tax": 0.00,
        "currencyId": 1,
        "state": "",
        "aptUnit": "",
        "address": "",
        "counselorId": counselorId
      }
      cb(emptySetting);
    }
  }catch(e) {
    console.log(e);
    utils.writeErrorLog('counselorBillSetting', 'show', `Exception while finding setting with counselorId=${counselorId}`, e);
    cb({ Code: 500, Status: false, Message: "Server Error" });
  };
}

const updateOrCreate = async (req, res, cb) => {
  // First try to find the record
  const counselorId = req.body.counselorId;


  const { userInfo: user } = req;
  if(!user || !user.isCounsellor || user.counselorId !== counselorId)
    return cb({Code:401, Message: 'Unauthorized'});

  try {
    const foundItem = await db.CounselorBillSetting.findOne({
      where: { counselorId: counselorId }
    });

    if (!foundItem) {
      // Item not found, create a new one
      const counselor_bill_setting = req.body;
      const result = await db.CounselorBillSetting.create(
        counselor_bill_setting,
        {
          attributes: attributesToEdit,
        }
      );
      cb(result);
    } else {
      // Found an item, update it
      const counselor_bill_setting = req.body;

      const result = await foundItem.update(counselor_bill_setting, {
        attributes: attributesToEdit
      });

      console.log(result);

      const ret = await db.CounselorBillSetting.findOne({
        where: { counselorId },
        attributes: attributesToShow
      });
      cb(ret);
    }
  } catch (e) {
    cb({ Code: 500, Status: true, Message: "Failed to updateOrCreate" });
  }
};

module.exports = {
  show,
  updateOrCreate
};
