'use strict';

var mongoose = require('mongoose'),
    employment_type = mongoose.model('employment_type'),
    user = mongoose.model('User'),
    post_job = mongoose.model('post_job');
var validate = require('../../common/validationCheck');
var config = require('../config/config');
var async = require("async");
var commonMethod = require('./commonMethod');
var jobPostValidator = require('../validator/postJob');
var CONST = require('../../common/Const');
var currentDate = new Date().setHours(0,0,0,0);
var postJobController = {};



/**
	 * @method validateJobPost
	 * @used for validating required field
	 * @param object job
	 * @return object validate.
	 * @author KTI0591
*/
var validateJobPost = function(job) {
	var requiredParameters = ['jobHeadline', 'practiceArea', 'skillsNeeded', 'jobDescription', 'city', 'state', 'zipCode', 'setting_id','duration', 'durationPeriod', 'rate', 'rateType', 'hours', 'hoursType', 'subTotal', 'total', 'status', 'currentRate'];
  var validate = jobPostValidator.missingParameters(job, requiredParameters);
  return validate;
}

var postJobSaveData = function(req, res){
	console.log("inside postJobSaveData");
	if (req.body.newJobPost) {
		delete req.body._id;
		post_job.saveData(req.body, function(err, resp){
			if(err){
				console.log("error : ",err);
				return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
			}else{
				user.updatePostJob(req.body.userId, resp._id, function(Error, Response){
					if(!Error){
						return res.json({Code:200, Status:true, Message:CONST.SUCCESS_POST_JOB});
					}	else{
						console.log("Error : ",Error);
						return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
					}
				})
			}
		})
	} else {
		var id = req.body._id;
		delete req.body._id;
		req.body.updated_at = new Date().getTime();
		post_job.UpdateQuery(id, req.body, function(err, resp){
			if (err) {
				return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
			} else {
				return res.json({Code:200, Status:true, Message:CONST.SUCCESS_POST_JOB});
			}
		})
	}

}


var savePostJob = function(req, res){
	employment_type.findJobType(req.body.hoursType, function(error, response){
		if(error){
			return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
		}else{
			if(response){
				if(response.name == "Part-time" || response.name == "Full-time"){
					if(req.body.rateType == 'HOURLY'){
						var subtotalAmt = Number(req.body.rate * req.body.hours).toFixed(2);
					}else{
						var subtotalAmt = Number(req.body.rate).toFixed(2);
					}
					if( Number(req.body.subTotal).toFixed(2) == subtotalAmt ){
						var total = Number(subtotalAmt) + Number((subtotalAmt * req.body.currentRate/100));
						// console.log(total, req.body.total, Number((subtotalAmt * req.body.currentRate/100)) , subtotalAmt * req.body.currentRate/100)
						if(Number(req.body.total).toFixed(2) == Number(total).toFixed(2)){
							if(req.body.paymentDetails.length>0){
								var count = 0;
								for(var i=0; i<req.body.paymentDetails.length; i++){
									if(req.body.paymentDetails[i].rate == 0 && !req.body.paymentDetails[i].delivery && !req.body.paymentDetails[i].dueDate){
										req.body.paymentDetails.splice(i, 1);
										i--;
									}else{
										if(req.body.paymentDetails[i].dueDate && req.body.newJobPost){
											var dueDate = new Date(req.body.paymentDetails[i].dueDate).getTime();
											if(dueDate >= currentDate){
												req.body.paymentDetails[i].dueDate = dueDate;
												count++;
											}else{
												return res.json({Code:400, Status:false, Message:CONST.INVALID_DUE_DATE});
											}
										}else{
											count++;
										}
									}

								}
								if(count == req.body.paymentDetails.length){
									postJobSaveData(req,res);
								}

							}else{
								postJobSaveData(req,res);
							}

						}else{
							return res.json({Code:400, Status:false, Message:CONST.TOTAL_AMT_ERROR});
						}
					}else{
						return res.json({Code:400, Status:false, Message:CONST.SUBTOTAL_ERROR});
					}
				}else{
				  return res.json({Code:404, Status:false, Message:CONST.INVALID_HOUR_TYPE_ID});
				}
			}else{
				return res.json({Code:404, Status:false, Message:CONST.INVALID_HOUR_TYPE_ID});
			}
		}
	})
}



/**
	 * @method postJobData
	 * @used for post a job
	 * @param object req, object res
	 * @return object res
	 * @author KTI0591
*/
postJobController.postJobData = function (req,res) {
	if(!!req.headers.token){
		commonMethod.checkUserLoggedIn(req.headers.token , function(err, result){
			if(err){
				return res.json({Code:400, Status:false, Message:err});
			}else{
				req.body.userId = result._id;

        var validateObj = validateJobPost(req.body);
				if(validateObj.isValid){
					if(validate.maxLength(req.body.jobHeadline, 150 ,true) && validate.maxLength(req.body.jobDescription, 2000 ,true) && validate.maxLength(req.body.zipCode, 5, true) && validate.minLength(req.body.zipCode, 5, true) && validate.maxLength(req.body.duration, 3, true) && validate.maxLength(req.body.rate, 6, true) && validate.maxLength(req.body.hours, 3, true)){
						if(!req.body.newJobPost){
							savePostJob(req,res);
						}else{
							if(!!req.body.estimatedStartDate){
								req.body.estimatedStartDate = new Date(req.body.estimatedStartDate).getTime();
							}
							if((!!req.body.estimatedStartDate && req.body.estimatedStartDate >= currentDate) || req.body.estimatedStartDate == ''){
								savePostJob(req,res);
							}else{
								return res.json({Code:400, Status:false, Message:CONST.INVALID_ESTIMATED_DATE});
							}
						}

					}else{
						return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
					}
				}else{
					return res.json({Code:400, Status:false, Message: validateObj.message});
				}
			}
		})
	}else{
		return res.json({Code:400, Status:false, Message:CONST.AUTH_FAIL});
	}
};


/**
	 * @method getPostJobData
	 * @used for post a job
	 * @param object req, object res
	 * @return object res
	 * @author KTI0591
*/
postJobController.getPostJobData = function (req,res) {
	if(!!req.headers.token){
		commonMethod.checkUserLoggedIn(req.headers.token , function(err, result){
			if(err){
				return res.json({Code:400, Status:false, Message:err});
			}else{
				if(!!req.params.jobId){
					post_job.getJobData({_id : req.params.jobId}, function(pErr, pResult){
						if(pErr){
							return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
						}else{
							if(pResult !== null){
								return res.json({Code:200, Status:true, Message:CONST.REQUEST_OK, Data:pResult});
							}else{
								return res.json({Code:404, Status:false, Message:CONST.NO_RECORD_FOUND});
							}
						}
					})
				}else{
					return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
				}
			}
		});
	}else{
		return res.json({Code:400, Status:false, Message:CONST.AUTH_FAIL});
	}
};




module.exports = postJobController ;

