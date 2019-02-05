'use strict';

var mongoose = require('mongoose'),
    user = mongoose.model('User'),
    user_log = mongoose.model('user_log');
var validate = require('../../common/validationCheck');
var config = require('../config/config');
var CONST = require('../../common/Const');
var contactusController = {};

/**
	 * @method contactUs
	 * @used Contact Us
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
contactusController.contactUs = function (req,res) {
	if(!!req.body.first_name && !!req.body.last_name && !!req.body.subject && !!req.body.email && !!req.body.message){
			if(validate.alphaWithDashOnly(req.body.first_name) && validate.maxLength(req.body.first_name, 50, true) && validate.alphaWithDashOnly(req.body.last_name) && validate.maxLength(req.body.last_name, 50, true) && validate.emailValidation(req.body.email) && validate.maxLength(req.body.subject, 50, true) && validate.maxLength(req.body.message, 1000, true)){
				req.body.email = req.body.email.trim();
				config.mailOptions.to = 'support@legably.com'; // For dynamic list of recievers
				// config.mailOptions.to = req.body.email; // For dynamic list of recievers
				config.mailOptions.subject = req.body.first_name +' ' +req.body.last_name +' | Legably Support Center ';
				config.mailOptions.text = req.body.first_name +' ' +req.body.last_name +' | Legably Support Center ';
        config.mailOptions.html = "<body bgcolor='#f2f2f2' style='font-family: arial; font-size: 13px; color:#000;'><div style='width: 100%'><table width='100%' cellspacing='0' cellpadding='0' border='0' align='center' style='background-color:#fff; max-width:800px;'><tbody><tr style='border:0;border-collapse:collapse; background-color:#013759; height: 60px;'><td style='text-align:center; margin:0;padding:9px 15px;color: #fff;'><img style='width: 150px;' src='"+config.hostPath+"/images/logo.png' alt='logo' /></td></tr><tr><td class='outer-padding' style='background:#fff; border:1px solid #e3e3e3; padding:15px;'><table width='100%;' style='font-size:14px;'><tbody><tr><td style='line-height:23px;'><div style='color:#4d4d4d;'><p><b>Name: </b>" +req.body.first_name + ' '+ req.body.last_name+ ", </p><p><b>Subject: </b>"+ req.body.subject+ "</p><p style='margin-bottom: 0;'><b>Message: </b>"+req.body.message +" </p><p style='line-height: 24px;'><b>Thanks,</b><br><b>Legably Support Team</b></p></td></tr><tr><td><p style='margin-bottom: 0;'>For general inquries or to request support with your account, please email<br/><a style=' color: #013759;' href='mailto:support@legably.com'>support@legably.com</a></p></td></tr></div></td></tr></tbody></table></td></tr></tbody></table></div></body>";
				// send mail with defined transport object
				config.transporter.sendMail(config.mailOptions, (error, info) => {
			    if(error){
			    	console.log("error ", error)
			        return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
			    }
					else{
						config.mailOptions.to = req.body.email; // For dynamic list of recievers
						config.mailOptions.subject = "We received your message! Here's what to expect next...";
						config.mailOptions.text = "We received your message! Here's what to expect next...";
		        config.mailOptions.html = "<body bgcolor='#f2f2f2' style='font-family: arial; font-size: 13px; color:#000;'><div style='width: 100%'><table width='100%' cellspacing='0' cellpadding='0' border='0' align='center' style='background-color:#fff; max-width:800px;'><tbody><tr style='border:0;border-collapse:collapse; background-color:#013759; height: 60px;'><td style='text-align:center; margin:0;padding:9px 15px;color: #fff;'><img style='width: 150px;' src='"+config.hostPath+"/images/logo.png' alt='logo' /></td></tr><tr><td class='outer-padding' style='background:#fff; border:1px solid #e3e3e3; padding:15px;'><table width='100%;' style='font-size:14px;'><tbody><tr><td style='line-height:23px;'><div style='color:#4d4d4d;'><p>Hi " +req.body.first_name + ' '+ req.body.last_name+ ", </p><p>Thanks! We’re working on your request, and will get back to you as soon as possible. </p></div></td></tr><tr><td><p style='line-height: 24px;'><b>Thanks,</b><br><b>Legably Support Team</b></p></td></tr><tr><td align='center' style='border-bottom: 1px solid #e4e4e4; width: 100%;'></td></tr><tr><td><p style='margin-bottom: 0;'>For general inquries or to request support with your account, please email<br/><a style=' color: #013759;' href='mailto:support@legably.com'>support@legably.com</a></p></td></tr></tbody></table></td></tr></tbody></table></div></body>";
						// send mail with defined transport object
						config.transporter.sendMail(config.mailOptions, (error, info) => {
					    if(error){
					    	console.log("error here", error)
					        return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
					    }
							else{

								return res.json({Code:200, Status:true, Message:CONST.SENT_CONTACTUS_MAIL});
							}
						});
					}
				});
			}else{
				return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
			}
	}else{
		return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
	}

};




module.exports = contactusController;

