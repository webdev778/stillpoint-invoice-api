'use strict';

var mongoose = require('mongoose'),
    user = mongoose.model('User'),
    user_log = mongoose.model('user_log'),
    employment_type = mongoose.model('employment_type'),
    state = mongoose.model('state');
var validate = require('../../common/validationCheck');
var config = require('../config/config');
var Guid = require('guid');
var fs = require('fs');
var path = require('path');
var async = require("async");
var _ = require('underscore');
var CONST = require('../../common/Const');
var commonMethod = require('./commonMethod');
var userProfileController = {};
var AWS = require('aws-sdk');
AWS.config.accessKeyId = config.aws.key;
AWS.config.secretAccessKey = config.aws.secret;
var s3Bucket = new AWS.S3({params: {Bucket: config.aws.bucket}});

/**
	 * @method updateUserProfile
	 * @used For Logout
	 * @param string token, integer currentStep, object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
var updateUserProfile = function(token, currentStep, userType, from, req, res){
	commonMethod.checkUserLoggedIn(token , function(err, result){
		if(err){
			return res.json({Code:400, Status:false, Message:err});
		}else{
			if(result[userType].last_visited_page != 5 && currentStep > result[userType].last_visited_page){
				req.body[userType].last_visited_page = currentStep;
			}else{
				req.body[userType].last_visited_page = result[userType].last_visited_page;
			}
			user.findProfile(result._id, userType,from,req.body[userType][from], req.body[userType].last_visited_page, function(fErr, fRes){
				if(fErr){
					// console.log(uErr);
					return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
				}else{
					if(currentStep == 1){
						fRes.first_name = req.body.first_name;
						fRes.last_name = req.body.last_name;
					}
					fRes.updated_at = new Date().getTime();
					user.updateProfile(result._id, fRes, function(uErr, uRes){
						if(uErr){
							// console.log("uErr" ,uErr);
							return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
						}else{
							return res.json({Code:200, Status:true, Message:CONST.SUCCESS_UPDATE_PROFILE});
						}
					})
				}
			})
		}
	})
}


/**
	 * @method getUserProfile
	 * @used For getting user details from database
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userProfileController.getUserProfile = function (req,res) {
	// console.log(req.headers)
	if(!!req.headers.token){
		commonMethod.checkUserLoggedIn(req.headers.token , function(err, result){
			if(err){
				return res.json({Code:400, Status:false, Message:err});
			}else{
				commonMethod.checkBasicInfo(result, req.params.forUser,req.params.fromUser, function(resultData){

					return res.json({Code:200, Status:true, Message:CONST.REQUEST_OK, Data: resultData, s3BucketUrl : config.bucketUrl});
				})
			}
		})
	}else{
		return res.json({Code:400, Status:false, Message:CONST.AUTH_FAIL});
	}
};

/**
	 * @method basicProfile
	 * @used For saving basic profile details of user
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userProfileController.basicProfile = function (req,res) {
	// console.log(!!req.body.first_name , !!req.body.last_name , !!req.body.job_seeker_info.basic_profile.basic_info.street_address,!!req.body.job_seeker_info.basic_profile.practice_area_id , req.body.job_seeker_info.basic_profile.do_you_have_malpractice_insurance)
	if(!!req.headers.token && !!req.body.first_name && !!req.body.last_name && !!req.body.job_seeker_info.basic_profile.basic_info.street_address && !!req.body.job_seeker_info.basic_profile.basic_info.city && !!req.body.job_seeker_info.basic_profile.basic_info.state_id && !!req.body.job_seeker_info.basic_profile.basic_info.zipcode && !!req.body.job_seeker_info.basic_profile.basic_info.phone_number && !!req.body.job_seeker_info.basic_profile.practice_area_id && req.body.job_seeker_info.basic_profile.do_you_have_malpractice_insurance){
		var eduCount = 0;
		var barCount = 0;
		if(!!req.body.job_seeker_info.basic_profile.education){
			for(var i=0; i<req.body.job_seeker_info.basic_profile.education.length; i++){
				if(!!req.body.job_seeker_info.basic_profile.education[i].school && !!req.body.job_seeker_info.basic_profile.education[i].degree_id && !!req.body.job_seeker_info.basic_profile.education[i].year){
					if(validate.maxLength(req.body.first_name, 50 ,true) && validate.maxLength(req.body.last_name, 50 ,true) && validate.maxLength(req.body.job_seeker_info.basic_profile.basic_info.street_address, 250 ,true) && validate.maxLength(req.body.job_seeker_info.basic_profile.education[i].year, 4 ,true) && validate.minLength(req.body.job_seeker_info.basic_profile.education[i].year, 4, true) && validate.maxLength(req.body.job_seeker_info.basic_profile.education[i].education_additional_information, 250, false)){
						eduCount++;
					}else{
						// console.log(CONST.INVALID_FORMAT)
						return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
					}
				}else{
					return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
				}
			}
		}else{
			return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
		}
		if(!!req.body.job_seeker_info.basic_profile.bar_admission){
			for(var i=0; i<req.body.job_seeker_info.basic_profile.bar_admission.length; i++){
				if(!!req.body.job_seeker_info.basic_profile.bar_admission[i].bar_registration_number && validate.maxLength(req.body.job_seeker_info.basic_profile.bar_admission[i].bar_registration_number, 15, true)){
						barCount++;
				}else{
					return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
				}
			}
		}else{
			return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
		}

		if(eduCount == req.body.job_seeker_info.basic_profile.education.length && barCount == req.body.job_seeker_info.basic_profile.bar_admission.length ){
			if(validate.alphaWithDashOnly(req.body.first_name) && validate.alphaWithDashOnly(req.body.last_name)){
				// console.log(req.body.education[0].year, validate.maxLength(req.body.education[0].year, 4))
				if(validate.maxLength(req.body.job_seeker_info.basic_profile.basic_info.zipcode, 5,true) && validate.minLength(req.body.job_seeker_info.basic_profile.basic_info.zipcode, 5,true) && validate.maxLength(req.body.job_seeker_info.basic_profile.basic_info.phone_number, 12, true) && validate.minLength(req.body.job_seeker_info.basic_profile.basic_info.phone_number, 12,true)){
					updateUserProfile(req.headers.token , 1, "job_seeker_info","basic_profile", req, res);
				}else{
					console.log("Invalid format here")
					return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
				}
			}
			else{
				console.log("Invalid format ,,,,,")
				return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
			}
		}else{
			console.log("here Invalid format" ,eduCount , barCount)
			return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
		}


	}else{
		return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
	}
};


/**
	 * @method experienceProfile
	 * @used For saving experience profile details of user.
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userProfileController.experienceProfile = function (req,res) {
	// console.log(req.body)
	if(!!req.headers.token && !!req.body.job_seeker_info.experience){
		if(req.body.job_seeker_info.experience.length == 0){
			updateUserProfile(req.headers.token , 2, "job_seeker_info","experience", req, res);
		}else{
			req.body.job_seeker_info.experience = _.sortBy(req.body.job_seeker_info.experience, function(o) {
																 var dt = new Date(o.start_date).getTime();
																 return -dt; })
			var expCount = 0;
			var currentDate = new Date().getTime();
			for(var i=0; i<req.body.job_seeker_info.experience.length; i++){
				console.log(!!req.body.job_seeker_info.experience[i].company_name , !!req.body.job_seeker_info.experience[i].designation , req.body.job_seeker_info.experience[i].employment_type_id.length,req.body.job_seeker_info.experience[i].employment_type_id.length > 0 , req.body.job_seeker_info.experience[i].skill_used_id.length > 0 , !!req.body.job_seeker_info.experience[i].experience_additional_information)
				if(!!req.body.job_seeker_info.experience[i].company_name || !!req.body.job_seeker_info.experience[i].designation || req.body.job_seeker_info.experience[i].employment_type_id.length > 0 || req.body.job_seeker_info.experience[i].skill_used_id.length > 0 || !!req.body.job_seeker_info.experience[i].experience_additional_information){
					if(validate.maxLength(req.body.job_seeker_info.experience[i].company_name, 100, false) && validate.maxLength(req.body.job_seeker_info.experience[i].designation, 100, false) && validate.maxLength(req.body.job_seeker_info.experience[i].experience_additional_information, 250, false)){
            if(!!req.body.job_seeker_info.experience[i].start_date && !!req.body.job_seeker_info.experience[i].end_date){
							var startDate = new Date(req.body.job_seeker_info.experience[i].start_date).getTime();
							var endDate =  new Date(req.body.job_seeker_info.experience[i].end_date).getTime();
           		if((startDate <= endDate) && (endDate <= currentDate)){
             		req.body.job_seeker_info.experience[i].start_date = startDate;
             		req.body.job_seeker_info.experience[i].end_date = endDate;
             		expCount++;
            	}else{
            		return res.json({Code:400, Status:false, Message:CONST.DATE_ERROR});
            	}
            }else{
            	expCount++;
            }
					}else{
						return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
					}
				}else{
					req.body.job_seeker_info.experience.splice(i, 1);
					i--;
				}
			}
			console.log(expCount, req.body.job_seeker_info.experience.length)
			if(expCount == req.body.job_seeker_info.experience.length){
				updateUserProfile(req.headers.token , 2, "job_seeker_info","experience", req, res);
			}else{
				return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
			}

		}
	}else{
		return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
	}

};


/**
	 * @method networkProfile
	 * @used For saving network profile details of user
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userProfileController.networkProfile = function (req,res) {
	if(!!req.headers.token){
		// console.log(validate.maxLength(req.body.network.lawyer_headline , 150, false) ,validate.maxLength(req.body.network.about_lawyer, 700, false) )
		if(validate.maxLength(req.body.job_seeker_info.network.lawyer_headline , 150, false) && validate.maxLength(req.body.job_seeker_info.network.about_lawyer, 700, false) ){
			if(validate.linkedinLinkValidation(req.body.job_seeker_info.network.linkedin_link, false)){
				// console.log("SDFSFS",req.body.photo.hasOwnProperty("dataUrl"), req.body.photo.length)
				if(req.body.job_seeker_info.network.photo.hasOwnProperty("dataUrl")){
					uploadFile('photos',req.body.job_seeker_info.network.photo, req.body.job_seeker_info.network.userId, function(error, success){
						if(error){
							return res.json({Code:400, Status:false, Message:error});
						}else{
							//var path = success.replace(config.fileUploadPath , config.hostPath+"/uploaded_files");
							req.body.job_seeker_info.network.photo = success;
							if(req.body.job_seeker_info.network.resume.hasOwnProperty("dataUrl")){
								uploadFile('resume',req.body.job_seeker_info.network.resume,req.body.job_seeker_info.network.userId, function(err, succ){
									if(err){
										return res.json({Code:400, Status:false, Message:err});
									}else{

										req.body.job_seeker_info.network.resume = succ;
										if(req.body.job_seeker_info.network.writing_samples.length > 0){
											uploadSamples(req.body.job_seeker_info.network.writing_samples, req.body.job_seeker_info.network.userId, function(Error, Success){
												if(Error){
													return res.json({Code:400, Status:false, Message:Error});
												}else{
													// console.log(Success);
													req.body.job_seeker_info.network.writing_samples = Success;
													req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
													updateUserProfile(req.headers.token , 3 , "job_seeker_info","network", req, res);
												}
											})
										}else{
											req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
											updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res);
										}
									}
								})
							}else{
								if(!req.body.job_seeker_info.network.resumeUpdate){
									//delete req.body.job_seeker_info.network.resume;
								}else{
									//deleteFile(config.fileUploadPath +"/resume/"+req.body.job_seeker_info.network.userId+'/');
									req.body.job_seeker_info.network.resume = '';
								}
								if(req.body.job_seeker_info.network.writing_samples.length > 0){
									uploadSamples(req.body.job_seeker_info.network.writing_samples,req.body.job_seeker_info.network.userId, function(Error, Success){
										if(Error){
											return res.json({Code:400, Status:false, Message:Error});
										}else{
											// console.log(Success);
											req.body.job_seeker_info.network.writing_samples = Success;
											req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
											updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res);
										}
									})
								}else{
									req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
									updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res);
								}
							}
						}
					})
				}else{
					if(!req.body.job_seeker_info.network.photoUpdate){
						req.body.job_seeker_info.network.photo = (req.body.job_seeker_info.network.photo).split('amazonaws.com/')[1];
					}else{
						// console.log("here deleting photo :",req.body.job_seeker_info.network.photoUpdate )
						//deleteFile(config.fileUploadPath +"/photo/"+req.body.job_seeker_info.network.userId+'/');
						req.body.job_seeker_info.network.photo = "";
					}
					if(req.body.job_seeker_info.network.resume.hasOwnProperty("dataUrl")){
						uploadFile('resume',req.body.job_seeker_info.network.resume, req.body.job_seeker_info.network.userId,function(err, succ){
							if(err){
									return res.json({Code:400, Status:false, Message:err});
								}else{
									req.body.job_seeker_info.network.resume = succ;
									if(req.body.job_seeker_info.network.writing_samples.length > 0){
										uploadSamples(req.body.job_seeker_info.network.writing_samples,req.body.job_seeker_info.network.userId, function(Error, Success){
											if(Error){
												return res.json({Code:400, Status:false, Message:Error});
											}else{
												// console.log(Success);
												req.body.job_seeker_info.network.writing_samples = Success;
												req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
												updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res);
											}
										})
									}else{
										req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
										updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res);
									}
								}
						})
					}else{
						if(!req.body.job_seeker_info.network.resumeUpdate){
							//delete req.body.job_seeker_info.network.resume;
						}else{
							//deleteFile(config.fileUploadPath +"/resume/"+req.body.job_seeker_info.network.userId+'/');
							req.body.job_seeker_info.network.resume = '';
						}
						if(req.body.job_seeker_info.network.writing_samples.length > 0){
							uploadSamples(req.body.job_seeker_info.network.writing_samples,req.body.job_seeker_info.network.userId, function(Error, Success){
								if(Error){
									return res.json({Code:400, Status:false, Message:Error});
								}else{
									// console.log(Success);
									req.body.job_seeker_info.network.writing_samples = Success;
									req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
									updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res);
								}
							})
						}else{
							req.body.job_seeker_info.network.writing_samples = req.body.job_seeker_info.network.writing_samples.concat(req.body.job_seeker_info.network.alreadyAddedSample);
							updateUserProfile(req.headers.token , 3, "job_seeker_info", "network", req, res);
						}
					}
				}
			}else{
				return res.json({Code:400, Status:false, Message:CONST.INVALID_LINKEDIN_LINK});
			}
		}
		else{
			return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
		}
	}else{
		return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
	}
};


/**
	 * @method jobProfile
	 * @used For saving job profile details of user
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userProfileController.jobProfile = function (req,res) {
	if(!!req.headers.token){
		if((req.body.job_seeker_info.job_profile.willing_to_work_locally == 'Y' && req.body.job_seeker_info.job_profile.willing_to_work_location_id.length > 0)|| req.body.job_seeker_info.job_profile.willing_to_work_locally == 'N'){
			if(!!req.body.job_seeker_info.job_profile.desired_job_type){
				async.each(req.body.job_seeker_info.job_profile.desired_job_type,
				  function(desired_job_type, callback){
				      employment_type.findJobType(desired_job_type.employment_type_id , function(err, result){
							if(err){
								callback(CONST.OOPS_ERROR);
							}else{
								if(result){
									// console.log(result);
									if(result.name == "Permanent"){
										desired_job_type.min_amount = parseInt(desired_job_type.min_amount);
										desired_job_type.max_amount = parseInt(desired_job_type.max_amount);
										if((desired_job_type.min_amount >= 50000 && desired_job_type.min_amount <=200000) && (desired_job_type.max_amount >= desired_job_type.min_amount && desired_job_type.max_amount <= 200000)){
											callback();
										} else{
											callback(CONST.INVALID_AMT);
										}
									}
									else if(result.name == "Contract"){
										desired_job_type.min_amount = parseInt(desired_job_type.min_amount);
										desired_job_type.max_amount = parseInt(desired_job_type.max_amount);
										if((desired_job_type.min_amount >= 0 && desired_job_type.min_amount <=2000) && (desired_job_type.max_amount >= desired_job_type.min_amount && desired_job_type.max_amount <= 2000)){
											callback();
										} else{
											callback(CONST.INVALID_AMT);
										}
									}
									else{
										callback(CONST.INVALID_EMP_ID);
									}
								}
								else{
									callback(CONST.INVALID_EMP_ID);
								}
							}
						})
				  },
				  function(err){
				  	if(err){
							return res.json({Code:400, Status:false, Message:err});
				  	}else{
				    	updateUserProfile(req.headers.token , 4, "job_seeker_info", "job_profile", req, res);
				  	}
				  }
				);
			}
		}
		else{
			return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
		}
	}else{
		return res.json({Code:400, Status:false, Message:CONST.AUTH_FAIL});
	}
};


/**
	 * @method uploadFile
	 * @used For uplaod file in public/uploaded_files/
	 * @param string from, object fileObj, string userId, function callback.
	 * @return function callback.
	 * @author KTI0591
*/
function uploadFile(from,fileObj, userId, callback){

	if(!!fileObj){
	  var dataObj = fileObj.dataUrl;
		var dataExp = dataObj.split(';');
		var ext = dataExp[0].split('/');
		var fileExt = ext[1];
		var encodeData = dataExp[1].split(',');
		var encodedData = encodeData[1];
		var fileName = from+"/" + userId+"/"+fileObj.name;
		var size = fileObj.size / 1000000;
		if(from == 'resume'){
			var validFormats = ['pdf', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'msword'];
		}else if(from == 'photos'){
			var validFormats = ['jpg', 'jpeg', 'png'];
		}
		if(validFormats.indexOf(fileExt) !== -1){
			if((from == 'resume' && size <= 3) || (from == 'photos' && size <= 10)){
				var buffer = new Buffer(encodedData, 'base64');
		        var uploadObj = {
		            ACL: 'public-read',
		            Key: fileName,
		            Body: buffer,
		            ContentEncoding: 'base64'
		        }
		        s3Bucket.upload(uploadObj, function (err, data) {
              if (err) {
                callback(CONST.UPLOAD_ERROR);
              } else {
                callback(null,fileName);
              }
	         });
			} else{
				callback(CONST.FILE_SIZE_ERROR);
			}
		} else{
			callback(CONST.INVALID_FILE_FORMAT);
		}
	} else{
		callback(CONST.INVALID_PARAMETER);
	}

}





/**
	 * @method uploadSamples
	 * @used For upload sample file in public/uploaded_files/writingSamples/
	 * @param object writingSamples, string userId, function callback.
	 * @return function callback.
	 * @author KTI0591
*/
var uploadSamples = function(writingSamples,userId, callback){
		var samplesFile = [];
		async.each(writingSamples,
	  function(sample, callback){
			var samplefile = {};
	    var dataExp = sample.dataUrl.split(';');
			var ext = dataExp[0].split('/');
			var fileExt = ext[1];
			var encodeData = dataExp[1].split(',');
			var encodedData = encodeData[1];
			var fileName = "writing-samples/" + userId+"/"+sample.filename;
			var file = config.fileUploadPath + "/writingSamples/"+ userId+"/"+sample.filename  ; // DESTINATION WHERE WE WANT TO UPLOAD FILE
			var validFormats = ['pdf', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'msword'];
			// var size = photoObj.size / 1000000;
			if(validFormats.indexOf(fileExt) !== -1){
				var sampleBuffer = new Buffer(encodedData, 'base64');
				var uploadObj = {
          ACL: 'public-read',
          Key: fileName,
          Body: sampleBuffer,
          ContentEncoding: 'base64'
        }
				s3Bucket.upload(uploadObj, function (err, data) {
		    	// console.log(resp)
			    if( err ){
			      // console.log( err );
			      callback(CONST.UPLOAD_ERROR);
			      // return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR, Err: err});
			    }else{
			    	samplefile.name = sample.filename;
			    //	var file = file.replace(config.fileUploadPath , "http://legablyqa.kiwitechopensource.com/ulpoaded_files");
			    	samplefile.path = fileName;
			    	samplesFile.push(samplefile);
			    //	console.log("samplesFile ",samplesFile , file, sample, "----------------");
			    	callback(null, fileName);
			    }
			  });
	  	}
	  	else{
				callback(CONST.INVALID_FILE_FORMAT);
			}
	  },
	  function(err,file){
	  	if(err){
	  		// console.log("err : ",err);
				callback(err);
	  	}else{
	  		// console.log("file here",file , samplesFile);
	    	callback(null,samplesFile);
	  	}
	  }
	);


}

/**
	 * @method deleteFile
	 * @used For delete file from folder
	 * @param string directory Folder path.
	 * @author KTI0591
*/
function deleteFile (directory){
	// console.log("inside delete" , directory);
	fs.readdir(directory, (err, files) => {
	  if (err) throw err;
	  for (const file of files) {
	    fs.unlink(path.join(directory, file), err => {
	      if (err) throw err;
	    });
	  }
	});

}

/**
	 * @method posterBasicProfile
	 * @used For saving poster basic profile details of user
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
userProfileController.posterBasicProfile = function (req,res) {
	// console.log(!!req.body.first_name , !!req.body.last_name , !!req.body.job_seeker_info.basic_profile.basic_info.street_address,!!req.body.job_seeker_info.basic_profile.practice_area_id , req.body.job_seeker_info.basic_profile.do_you_have_malpractice_insurance)
	if(!!req.headers.token && !!req.body.first_name && !!req.body.last_name && !!req.body.job_posters_info.basic_profile.basic_info.street_address && !!req.body.job_posters_info.basic_profile.basic_info.city && !!req.body.job_posters_info.basic_profile.basic_info.state_id && !!req.body.job_posters_info.basic_profile.basic_info.zipcode && !!req.body.job_posters_info.basic_profile.basic_info.phone_number){
		if(validate.alphaWithDashOnly(req.body.first_name) && validate.alphaWithDashOnly(req.body.last_name) && validate.maxLength(req.body.job_posters_info.basic_profile.basic_info.zipcode, 5,true) && validate.minLength(req.body.job_posters_info.basic_profile.basic_info.zipcode, 5,true) && validate.maxLength(req.body.job_posters_info.basic_profile.basic_info.phone_number, 12, true) && validate.minLength(req.body.job_posters_info.basic_profile.basic_info.phone_number, 12,true) && validate.maxLength(req.body.job_posters_info.basic_profile.firm_name,100, false) && validate.maxLength(req.body.job_posters_info.basic_profile.title,100, false)){
				if((!!req.body.job_posters_info.basic_profile.website_url && validate.websiteValidation(req.body.job_posters_info.basic_profile.website_url)) || req.body.job_posters_info.basic_profile.website_url == ''){
					updateUserProfile(req.headers.token , 1, "job_posters_info", "basic_profile", req, res);
				}else{
					return res.json({Code:400, Status:false, Message:CONST.INVALID_URL});
				}
			}
			else{
				console.log("Invalid format ,,,,,")
				return res.json({Code:400, Status:false, Message:CONST.INVALID_FORMAT});
			}
	}else{
		return res.json({Code:400, Status:false, Message:CONST.INVALID_PARAMETER});
	}
};

module.exports = userProfileController ;
