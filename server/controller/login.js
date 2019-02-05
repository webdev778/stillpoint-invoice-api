'use strict';

var mongoose = require('mongoose'),
    user = mongoose.model('User'),
    user_log = mongoose.model('user_log');
var validate = require('../../common/validationCheck');
var Guid = require('guid');
var CONST = require('../../common/Const');
var config = require('../config/config');
var loginController = {};

/**
	 * @method loginUser
	 * @used For Login
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
loginController.loginUser = function (req,res) {
    var token = Guid.create().value;
    req.body.email = req.body.email.trim();
    if(!!req.body.email && !!req.body.password){
		if(validate.emailValidation(req.body.email)){
			if(validate.passwordValidation(req.body.password)){
				user.findByEmail(req.body.email,function(err,result){
			        if (err){
			        	// log(err);
			           return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
			        }
			        else{
				        if(result){
				         	user.comparePassword(req.body.password, result.password, function(error, success){
				         		// console.log("error : ",error," success : ",success);
				         		if(error){
				         			return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
				         		}else{
				         			if(success){
							         	user_log.saveData({user_id:result._id, token:token, status: true},function(err,uRes){
							         		if (err){
							         			// console.log(error);
							         		    return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
							         		}
							         		else{
			        							// console.log(result)

							         			var data = {
				         								first_name : result.first_name,
				         								last_name : result.last_name,
				         								email : result.email,
				         								userId : result._id,
				         								role: result.role,
				         								userImage : result.job_seeker_info.network.photo,
				         								s3BucketUrl : config.bucketUrl,
				         								token : token
				         							}
				         							// console.log(data);
							         			return res.json({Code:200, Status:true,Data:data,Message:CONST.REQUEST_OK})
							         		}
							         	});
				         			}else{
				         				// console.log(success);
				         				return res.json({Code:401, Status:false, Message:CONST.INVALID_CREDENTIALS});
				         			}
				         		}
				         	})
						}
						else{
							// console.log(result)
						 	return res.json({Code:401, Status:false, Message:CONST.INVALID_CREDENTIALS});
						}
					}
			    });
			}else{
				return res.json({Code:400, Status:false, Message:CONST.INVALID_PASS_FORMAT});
			}
		}
		else{
			return res.json({Code:400, Status:false, Message:CONST.INVALID_EMAIL_FORMAT});
		}
    }else{
    	if(!!req.body.email){
    		return res.json({Code:400, Status:false, Message:ENTER_PASSWORD});
    	}else{
    		return res.json({Code:400, Status:false, Message:CONST.ENTER_EMAIL});
    	}
    }
};


/**
	 * @method logout
	 * @used For Logout
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
loginController.logout = function (req,res) {
	if(!!req.headers.token){
		user_log.findByToken(req.headers.token, function(err,uRes){
	 		if (err){
	 		    return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
	 		}
	 		else{
	 			if(uRes){
	 				user_log.removeEntry(uRes._id, function(error, resp){
	 					if(error){
	 						return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
	 					}else{
	 						return res.json({Code:200, Status:true,Message:CONST.REQUEST_OK});
	 					}
	 				})
	 			}else{
	 				return res.json({Code:401, Status:false,Message:CONST.AUTH_FAIL});
	 			}
	 		}
	 	});
	}
	else{
		return res.json({Code:400, Status:false, Message:CONST.AUTH_FAIL});
	}
};


module.exports = loginController;

