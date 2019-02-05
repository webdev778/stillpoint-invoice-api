'use strict';

var mongoose = require('mongoose'),
    user = mongoose.model('User'),
    user_log = mongoose.model('user_log'),
    forgotPassword = mongoose.model('forgotPassword');
var validate = require('../../common/validationCheck');
var config = require('../config/config');
var Guid = require('guid');
var CONST = require('../../common/Const');
var userController = {};


/**
	 * @method signupUser
	 * @used Save user details
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userController.signupUser = function (req,res) {
	// console.log(req.body)
	// if(!!req.body.first_name && !!req.body.last_name && !!req.body.email && !!req.body.password && !!req.body.confirm_password){
		req.body.email = req.body.email.trim();
		if(validate.alphaWithDashOnly(req.body.first_name) && validate.maxLength(req.body.first_name, 50, true) && validate.alphaWithDashOnly(req.body.last_name) && validate.maxLength(req.body.last_name, 50, true)){
			if(validate.emailValidation(req.body.email)){
				if(req.body.password == req.body.confirm_password){
					if(validate.passwordValidation(req.body.password)){
						// After all valdiation check, save data into user collection
				      	var guid = Guid.create();
				      	delete req.body.confirm_password; //As no need to save confirm passwordin database
						// req.body.token = guid.value;
					    user.signupUser(req.body,function(err, result) {
					      if (!err) {
					      	config.mailOptions.to = req.body.email; // For dynamic list of recievers
					        config.mailOptions.html = "<body bgcolor='#f2f2f2' style='font-family: arial; font-size: 13px; color:#000;'><div style='width: 100%'><table width='100%' cellspacing='0' cellpadding='0' border='0' align='center' style='background-color:#fff; max-width:800px;'><tbody><tr style='border:0;border-collapse:collapse; background-color:#013759; height: 60px;'><td style='text-align:center; margin:0;padding:9px 15px;color: #fff;'><img style='width: 150px;' src='"+config.hostPath+"/images/logo.png' alt='logo' /></td></tr><tr><td class='outer-padding' style='background:#fff; border:1px solid #e3e3e3; padding:15px;'><table width='100%;' style='font-size:14px;'><tbody><tr><td style='line-height:23px;'><div style='color:#4d4d4d;'><p>Hi "+ req.body.first_name + ' ' + req.body.last_name+",</p><p>Welcome to Legably!</p><p>Thank you for creating your Legably account.  If you have any questions about using Legably, are in need of support, or have suggestions for improving our platform, please don’t hesitate to reach out to us at <a style=' color: #013759;' href='mailto:support@legably.com'>support@legably.com</a>.</p><p>If you didn’t create a Legably account, please let us know immediately by responding to this email.</p><p>We look forward to working with you!</p><p style='line-height: 24px;'><b>Sincerely,</b><br><b>Legably Support Team</b><br><a style=' color: #013759;' href='mailto:support@legably.com'>support@legably.com</a><br><a style=' color: #013759;' href="+config.hostPath+">www.legably.com</a></p></td></tr></tbody></table></td></tr></tbody></table></div></body>";
  								config.mailOptions.subject = "Welcome to Legably";
									config.mailOptions.text = "Welcome to Legably";
									// send mail with defined transport object
									config.transporter.sendMail(config.mailOptions, (error, info) => {
								    if(error){
								        return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
								    }
										else{
			            		return res.json({Code:200, Status:true, Message:CONST.REQUEST_OK});
										}
									});
					      } else {
					      	if(err.code == 11000){
					        	return res.json({Code:400, Status:false, Message:CONST.EMAIL_ALREADY_EXIST});
					      	}else{
					        	return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
					      	}
					      }
					    });
					}else{
						return res.json({Code:400, Status:false, Message:CONST.INVALID_PASS_FORMAT});
					}
				}else{
					return res.json({Code:400, Status:false, Message:CONST.MISMATCH_PASS_CONFPASS});
				}
			}
			else{
				return res.json({Code:400, Status:false, Message:CONST.INVALID_EMAIL_FORMAT});
			}
		}else{
			return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
		}
	// }else{
	// 	return res.json({Code:400, Status:false, Message:"Reqiured parameters are missing"});
	// }
};

/**
	 * @method forgotPass
	 * @used Sent reset password link to user.
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userController.forgotPass = function (req,res) {
	if(!!req.body.email){
		req.body.email = req.body.email.trim();
			if(validate.emailValidation(req.body.email)){
				user.findByEmail(req.body.email, function(err, result) {
		      if(result) {
		      	var data = {}
		      	var guid = Guid.create();
		      	data.user_id = result._id;
		      	data.forgot_token = guid.value;
		      	data.created_at = Date.now();
		      	forgotPassword.saveData(data, function(Error, Result){
			      	if(!Error){
								config.mailOptions.to = req.body.email; // For dynamic list of recievers
								config.mailOptions.subject = "Reset your Legably Password";
								config.mailOptions.text = "Reset your Legably Password";
				        config.mailOptions.html = "<body bgcolor='#f2f2f2' style='font-family: arial; font-size: 13px; color:#000;'><div style='width: 100%'><table width='100%' cellspacing='0' cellpadding='0' border='0' align='center' style='background-color:#fff; max-width:800px;'><tbody><tr style='border:0;border-collapse:collapse; background-color:#013759; height: 60px;'><td style='text-align:center; margin:0;padding:9px 15px;color: #fff;'><img style='width: 150px;' src='"+config.hostPath+"/images/logo.png' alt='logo' /></td></tr><tr><td class='outer-padding' style='background:#fff; border:1px solid #e3e3e3; padding:15px;'><table width='100%;' style='font-size:14px;'><tbody><tr><td style='line-height:23px;'><div style='color:#4d4d4d;'><p>Dear "+result.first_name + ' '+ result.last_name +", </p><p>This e-mail is in response to your recent request to recover a forgotten password. Password security features are in place to ensure the security of your profile information. To reset your password, please click the link below and follow the instructions provided.</p><p><a href='"+config.hostPath+"/resetPassword/"+data.forgot_token+"' target='blank'> "+config.hostPath+"/resetPassword/"+data.forgot_token+"</a></p><p>This link will remain active for the next 3 hours.</p><p>Please do not reply to this e-mail.</p><p style='line-height: 24px;'><b>Thanks,</b><br><b>Legably Support Team</b></p></td></tr><tr><td><p style='margin-bottom: 0;'>For general inquries or to request support with your account, please email<br/><a style=' color: #013759;' href='mailto:support@legably.com'>support@legably.com</a></p></td></tr></tbody></table></td></tr></tbody></table></div></body>";
								// send mail with defined transport object
								config.transporter.sendMail(config.mailOptions, (error, info) => {
							    if(error){
							    	console.log(error)
							        return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
							    }
									else{
										return res.json({Code:200, Status:true, Message:CONST.SENT_RESET_EMAIL});
									}
								});
		      		}else{
		      			return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
		      		}
		      	})
		      	// setup email data with unicode symbols
		      }else{
		      	return res.json({Code:401, Status:false, Message:CONST.EMAIL_DOESNOT_EXIST});
		      }
		    });
			}else{
				return res.json({Code:400, Status:false, Message:CONST.INVALID_EMAIL_ADD});
			}
	}else{
		return res.json({Code:400, Status:false, Message:CONST.ENTER_EMAIL});
	}
};

/**
	 * @method checkResetLink
	 * @used Check for reset password link expiration.
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userController.checkResetLink = function (req,res) {
	if(!!req.params.secretId){
    forgotPassword.findByToken(req.params.secretId,function(err, result) {
    	if(err){
				return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
    	}else{
	      if(result){
	      	var reqTime = new Date(result.created_at);
	      	var expireTime = reqTime.setHours(result.created_at.getHours()+3);
	      	if(new Date() < new Date(expireTime)){
	      		return res.json({Code:200, Status:true, Message:CONST.REQUEST_OK});
	      	}else{
	      		return res.json({Code:401, Status:false, Message:CONST.EXPIRED_LINK});
	      	}
	      } else {
          return res.json({Code:401, Status:false, Message:CONST.INVALID_LINK});
	      }
    	}
    });
	}else{
		return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
	}
};

/**
	 * @method resetPass
	 * @used Will update user password after successfully reset.
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userController.resetPass = function (req,res) {
	if(!!req.params.secretId && !!req.body.password && !!req.body.confirm_password){
    forgotPassword.findByToken(req.params.secretId,function(err, result) {
    	if(err){
				return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
    	}else{
	      if(result){
	      	var reqTime = new Date(result.created_at);
	      	var expireTime = reqTime.setHours(result.created_at.getHours()+24);
	      	if(new Date() < new Date(expireTime)){
						if(validate.passwordValidation(req.body.password) && validate.passwordValidation(req.body.confirm_password)){
							if(req.body.password == req.body.confirm_password){
								// After all valdiation check, update password into user collection
								user.encryptPassword(req.body.password,function(Err, Password){
									if(Password){
										user.updatePassword(result.user_id, Password, function(Error, Result){
											if(!Error){
												// console.log(Result);
												forgotPassword.removeEntry(result._id, function(dbErr, success){
													if(!dbErr){
														return res.json({Code:200, Status:true, Message:CONST.SUCCESS_RESET_PASS});
													}else{
														return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
													}
												})
											}else{
												return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
											}
										})
									}else{
										return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
									}
								})
							}else{
								return res.json({Code:400, Status:false, Message:CONST.MISMATCH_PASS_CONFPASS});
							}
						}else{
							return res.json({Code:400, Status:false, Message:CONST.INVALID_PASS_FORMAT});
						}
	      	}else{
	      		return res.json({Code:401, Status:false, Message:CONST.EXPIRED_LINK});
	      	}
	      } else {
          return res.json({Code:401, Status:false, Message:CONST.INVALID_LINK});
	      }
    	}
    });
	}else{
		return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
	}
};

/**
	 * @method changePassword
	 * @used Will update user password after successfully change password.
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userController.changePassword = function (req,res) {
	// console.log(req.headers.token);
	if(!!req.headers.token && !!req.body.old_password && !!req.body.password && !!req.body.confirm_password){
		// var user_id = commonFunc.checkUserLoggedIn();
		user_log.findByToken(req.headers.token, function(err, result){
			if(result){
				// console.log(result._id);
				user.findById(result.user_id, function(uErr, uRes){
					// console.log(uErr,uRes)
					if(uErr){
						return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
					}else{
						if(uRes){
							if(validate.passwordValidation(req.body.password) && validate.passwordValidation(req.body.confirm_password)){
								if(req.body.password == req.body.confirm_password){
							    // After all valdiation check, update password into user collection
							    // console.log(uRes)
							    user.comparePassword(req.body.old_password, uRes.password, function(error, success){
				         		// console.log("error : ",error," success : ",success);
				         		if(error){
				         			// console.log("error : ",error);
				         			return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
				         		}else{
				         			if(success){
				     						user.encryptPassword(req.body.password,function(Err, Password){
													if(Password){
														user.updatePassword(result.user_id, Password, function(Error, Result){
															if(!Error){
																// console.log(Result);
																return res.json({Code:200, Status:true, Message:CONST.SUCCESS_RESET_PASS});
															}else{
																return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
															}
														})
													}else{
														return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
													}
												})
				         			}else{
				         				// console.log(success);
				         				return res.json({Code:401, Status:false, Message:CONST.CURRPASS_DOESNOT_EXIST});
				         			}
				         		}
				         	})
								}else{
									return res.json({Code:400, Status:false, Message:CONST.MISMATCH_PASS_CONFPASS});
								}
							}else{
								return res.json({Code:400, Status:false, Message:CONST.INVALID_PASS_FORMAT});
							}
						}else{
							return res.json({Code:401, Status:false, Message:CONST.AUTH_FAIL});
						}
					}
				})
			}else{
				return res.json({Code:401, Status:false, Message:CONST.AUTH_FAIL});
			}
		})
	}else{
		return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
	}

};



module.exports = userController;

