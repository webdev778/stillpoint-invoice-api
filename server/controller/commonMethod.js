'use strict';

var mongoose = require('mongoose'),
	CONST = require('../../common/Const'),
	user = mongoose.model('User'),
  user_log = mongoose.model('user_log');
	// commonController = {};

/**
	 * @method getDropdownList
	 * @used Give list of values stored in database for respective collection name passed in param
	 * @param string modelName.
	 * @return object res.
	 * @author KTI0591
*/
var getDropdownList = function (modelName){
 	return function(req,res) {
    var modelObj = mongoose.model(modelName);
		modelObj.getDropdown({}, function(dbErr, result){
			if(!dbErr){
				return res.json({Code:200, Status:true, Message:CONST.REQUEST_OK , Data : result});
			}else{
				return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
			}
		})
	};
};

/**
	 * @method getCurrentRate
	 * @used Give value stored in database for rate setting
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
var getCurrentRate = function() {
	return function(req,res){
	  var modelObj = mongoose.model("rate_setting");
		modelObj.getCurrentRate({}, function(dbErr, result){
			if(!dbErr){
				return res.json({Code:200, Status:true, Message:CONST.REQUEST_OK , Data : result});
			}else{
				return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
			}
		})
	};
};


/**
	 * @method checkUserLoggedIn
	 * @used for user authentication
	 * @param object data, function callback.
	 * @return function callback.
	 * @author KTI0591
*/
var checkUserLoggedIn = function(data, callback){
	user_log.findByToken(data, function(err, result){
			if(result){
				// console.log(result)
				user.findById(result.user_id, function(uErr, uRes){
					if(uErr){
						// console.log("here")
						callback(CONST.OOPS_ERROR);
					}else{
						if(uRes){
							callback(null, uRes);
						}else{
							// console.log(' inner here')
							callback(CONST.AUTH_FAIL);
						}
					}
				})
			}else{
				// console.log('here')
				callback(CONST.OOPS_ERROR);
			}
		})
}

/**
	 * @method checkBasicInfo
	 * @used for getting prefilled information for user while creating his profile, if user had completed his other profile earlier.
	 * @param object result, string forUser, string fromUser, function callback.
	 * @return function callback.
	 * @author KTI0591
*/
var checkBasicInfo = function(result,forUser, fromUser,callback){
	// console.log(result,forUser, fromUser)
	if(!result[forUser].basic_profile.basic_info.street_address && !!result[fromUser].basic_profile.basic_info.street_address){
		result[forUser].basic_profile.basic_info = result[fromUser].basic_profile.basic_info;
		if(result[forUser].basic_profile.practice_area_id.length == 0 && result[fromUser].basic_profile.practice_area_id.length > 0){
			result[forUser].basic_profile.practice_area_id = result[fromUser].basic_profile.practice_area_id;
		}
		if(forUser == 'job_seeker_info'){
			if(result[forUser].basic_profile.bar_admission.length == 0 && result[fromUser].basic_profile.practice_location_id.length > 0){
				// result[forUser].basic_profile.bar_admission[] = result[fromUser].basic_profile.practice_location_id.length;	
				for(var i=0; i < result[fromUser].basic_profile.practice_location_id.length; i++){
					// console.log("result[forUser].basic_profile.bar_admission[i]",forUser, i, result[forUser].basic_profile,result[forUser].basic_profile.bar_admission[i]);
					result[forUser].basic_profile.bar_admission.push({"bar_state_id": result[fromUser].basic_profile.practice_location_id[i]});
				}
				if(i==result[fromUser].basic_profile.practice_location_id.length){
					callback(result);
				}
			}else{
				callback(result);
			}
		}else{
			if(result[forUser].basic_profile.practice_location_id.length == 0 && result[fromUser].basic_profile.bar_admission.length > 0){
				barStateIdToArr(result , forUser, fromUser,'basic_profile','practice_location_id',callback)
			}else{
				callback(result);
			}
		}
	}else{
		if(forUser == 'job_seeker_info' && result[forUser].is_profile_completed == 'N'){
			if(result[forUser].basic_profile.bar_admission.length > 0 && result[forUser].job_profile.willing_to_work_location_id.length == 0){
				barStateIdToArr(result , forUser, forUser, 'job_profile', 'willing_to_work_location_id',callback);
			} else{
				callback(result);
			}
		}else{
			callback(result);
		}
	}
}

/**
	 * @method barStateIdToArr
	 * @used for collaborating state license id to mulitselect location array
	 * @param object result, string forUser, string fromUser, string key.
	 * @return function callback.
	 * @author KTI0591
*/
var barStateIdToArr = function(result, forUser, fromUser, profileType, key,callback){
	for(var i=0; i<result[fromUser].basic_profile.bar_admission.length; i++){
		result[forUser][profileType][key][i] = result[fromUser].basic_profile.bar_admission[i].bar_state_id;
	}
	if(i==result[fromUser].basic_profile.bar_admission.length){
		callback(result);
	}
}

/**
	 * @method getEstHourType
	 * @used Give value stored in database for rate setting
	 * @param object req, object res.
	 * @return object res.
	 * @author KTI0591
*/
var getEstHourType = function() {
	return function(req,res){
	  var modelObj = mongoose.model("employment_type");
		modelObj.getDropdown({ "_id":{$in:["599e8a3759bbb543d7a539dc" , "599e8a4f59bbb543d7a539dd"]}}, function(dbErr, result){
			if(!dbErr){
				console.log(dbErr)
				return res.json({Code:200, Status:true, Message:CONST.REQUEST_OK , Data : result});
			}else{
				return res.json({Code:400, Status:false, Message:CONST.OOPS_ERROR});
			}
		})
	};
};

module.exports = {
	getDropdownList  : getDropdownList ,
	checkUserLoggedIn : checkUserLoggedIn,
	checkBasicInfo : checkBasicInfo,
	getCurrentRate : getCurrentRate,
	getEstHourType : getEstHourType
}

