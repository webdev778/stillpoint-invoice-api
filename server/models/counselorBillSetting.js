"use strict";

var rfr = require("rfr"),
  moment = require("moment"),
  _ = require("lodash");

var config = rfr("/server/shared/config"),
  constant = rfr("/server/shared/constant"),
  mailHelper = rfr("/server/shared/mailHelper"),
  utils = rfr("/server/shared/utils"),
  db = rfr("/server/db");

function index(req, res, cb) {
  utils.writeInsideFunctionLog("counselor_bill_settings", "index");
  db.CounselorBillSetting.findOne({
    
    where: { counselorId: req.params.counselorId },
    attributes: ['id', 'businessName', 'street', 'city', 'country', 'postCode', 'tax', 'currencyId', 'state', 'aptUnit', 'counselorId']
  })
    .then(counselor_bill_settings => {
      if (counselor_bill_settings) {
        cb(counselor_bill_settings);
      } else {
        cb({ Code: 404, Status: false, Message: "no data" });
      }
    })
    .catch(err => {
      cb({ Code: 500, Status: false, Message: "model error" });
    });
}

const updateOrCreate = async (req, res, cb) => {
  // First try to find the record
  const counselorId = req.body.counselorId;

  try {
    const foundItem = await db.CounselorBillSetting.findOne({
      where: { counselorId: counselorId }
    });

    if (!foundItem) {
      // Item not found, create a new one
      const counselor_bill_setting = req.body;
      const result = await db.CounselorBillSetting.create(
        counselor_bill_setting
      );
      cb({ Code: 200, Status: true, Message: result });
    } else {
      // Found an item, update it
      const counselor_bill_setting = req.body;

      const result = await db.CounselorBillSetting.update(req.body, {
        where: { counselorId: counselorId },
        attributes: [
          "businessName",
          "street",
          "city",
          "currencyId",
          "country",
          "postCode",
          "state",
          "aptUnit",
          "tax"
        ]
      });
      cb({ Code: 200, Status: true, Message: result });
    }
  } catch (e) {
    cb({ Code: 500, Status: true, Message: "Failed to updateOrCreate" });
  }
};

module.exports = {
  index,
  updateOrCreate
};
