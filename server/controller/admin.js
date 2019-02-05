var jsonexport = require('jsonexport');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var config = require('../config/config');
var commonMethod = require('./commonMethod');
var CONST = require('../../common/Const');

var degree = mongoose.model('degree');
var state = mongoose.model('state');
var skills = mongoose.model('skills');
var employment_type = mongoose.model('employment_type');
var practice_area = mongoose.model('practice_area');
var interested_in_hiring = mongoose.model('interested_in_hiring');
var setting = mongoose.model('setting');
var post_job = mongoose.model('post_job');
var users = mongoose.model('User');

function _getRatePrefix() {
  return '$';
}

function _getSeperatorObj() {
  return {
    multiValSeperator: '; ',
    multiColSeperator: ' | ',
    multiColMultiValSeperator: ' @ '
  };
}

function _getFormattedDate(date) {
  if (date) {
    var mm = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    var dd = ('0' + date.getUTCDate()).slice(-2);
    return (mm + '/' + dd + '/' + date.getUTCFullYear());
  } else {
    return '';
  }
}

function exportUsers(req, res, callback) {
  var statesData = {},
  degreeData = {},
  skillsData = {},
  employmentTypeData = {},
  practiceAreasData = {},
  categoriesData = {};

  if (!!req.headers.token) {
    commonMethod.checkUserLoggedIn(req.headers.token , function(err, result){
      if (err) {
        return res.json({Code: 400, Status: false, Message: err});
      } else {
        if (result) {
          if (result.role == "admin") {
              degree.getDropdown({}, function(err, result) {
                if (err) return callback(resObj);
                result.forEach(function(item) {
                  degreeData[item._id] = item.name;
                })
              });

              state.getDropdown({}, function(err, result) {
                if (err) return callback(resObj);
                result.forEach(function(item) {
                  statesData[item._id] = item.name;
                })
              });

              skills.getDropdown({}, function(err, result) {
                if (err) return callback(resObj);
                result.forEach(function(item) {
                  skillsData[item._id] = item.name;
                })
              });

              employment_type.getDropdown({}, function(err, result) {
                if (err) return callback(resObj);
                result.forEach(function(item) {
                  employmentTypeData[item._id] = item.name;
                })
              });

              interested_in_hiring.getDropdown({}, function(err, result) {
                if (err) return callback(resObj);
                result.forEach(function(item) {
                  categoriesData[item._id] = item.name;
                })
              });

              practice_area.getDropdown({}, function(err, result) {
                if (err) return callback(resObj);
                result.forEach(function(item) {
                  practiceAreasData[item._id] = item.name;
                })
              });
              var queryObj = {
                'query': {'role':'user'},
                'sortOption': {'created_at': 1}
              }
              users.findQuery(queryObj, function(err, resp) {
                if(!err){
                  var finalResult = [];
                  resp.map(function(r){
                    var temp = r._doc;
                    var defaultVal = 'N';
                    var ratePrefix = _getRatePrefix();
                    var sepObj = _getSeperatorObj();
                    var seekerColPrefix = 'Seeker - ';
                    var posterColPrefix = 'Poster - ';
                    var seekerInfo = temp['job_seeker_info'];
                    var seekerBasicProfile = seekerInfo['basic_profile'];
                    var seekerBasicInfo = seekerBasicProfile['basic_info'];
                    var seekerNetwork = seekerInfo['network'];
                    var seekerJobProfile = seekerInfo['job_profile'];
                    var posterBasicProfile = temp['job_posters_info']['basic_profile'];
                    var posterBasicInfo = posterBasicProfile['basic_info'];
                    var s3BucketPath = config['bucketUrl'];
                    var result = {
                      'First Name': temp['first_name'],
                      'Last Name': temp['last_name'],
                      'Email': temp['email'],
                      [seekerColPrefix + 'Street Address']: seekerBasicInfo['street_address'],
                      [seekerColPrefix + 'City']: seekerBasicInfo['city'],
                      [seekerColPrefix + 'State']: statesData[seekerBasicInfo['state_id'] || null],
                      [seekerColPrefix + 'Zip Code']: seekerBasicInfo['zipcode'],
                      [seekerColPrefix + 'Phone Number']: seekerBasicInfo['phone_number'],
                      [seekerColPrefix + 'Education']: '',
                      [seekerColPrefix + 'State Licensure']: '',
                      [seekerColPrefix + 'Practice Areas']: '',
                      [seekerColPrefix + 'Skills']: '',
                      [seekerColPrefix + 'Other Skills']: seekerBasicProfile['others'] || '',
                      [seekerColPrefix + 'Malpractice Insurance']: seekerBasicProfile['do_you_have_malpractice_insurance'],
                      [seekerColPrefix + 'Experience']: '',
                      [seekerColPrefix + 'Photo']: seekerNetwork['photo'] ? (s3BucketPath + seekerNetwork['photo']) : '',
                      [seekerColPrefix + 'Lawyer Headline']: seekerNetwork['lawyer_headline'],
                      [seekerColPrefix + 'About Lawyer']: seekerNetwork['about_lawyer'],
                      [seekerColPrefix + 'Linkedin Url']: seekerNetwork['linkedin_link'],
                      [seekerColPrefix + 'Resume Link']: seekerNetwork['resume'] ? (s3BucketPath + seekerNetwork['resume']) : '',
                      [seekerColPrefix + 'Writing Samples Link']: '',
                      [seekerColPrefix + 'Willing To Work Locally']: seekerJobProfile['willing_to_work_locally'] || defaultVal,
                      [seekerColPrefix + 'Work Location Locally']: '',
                      [seekerColPrefix + 'Willing To Work Remotely']: seekerJobProfile['willing_to_work_remotely'] || defaultVal,
                      [seekerColPrefix + 'Willing To Work Full Time']: seekerJobProfile['willing_to_work_full_time'] || defaultVal,
                      [seekerColPrefix + 'Willing To Work Part Time']: seekerJobProfile['willing_to_work_part_time'] || defaultVal,
                      [seekerColPrefix + 'Desired Job Type - Permanent']: defaultVal,
                      [seekerColPrefix + 'Desired Job Min Amount - Permanent']: ratePrefix + 50000,
                      [seekerColPrefix + 'Desired Job Max Amount - Permanent']: ratePrefix + 200000,
                      [seekerColPrefix + 'Desired Job Type - Contract']: defaultVal,
                      [seekerColPrefix + 'Desired Job Min Amount - Contract']: ratePrefix + 0,
                      [seekerColPrefix + 'Desired Job Max Amount - Contract']: ratePrefix + 2000,
                      [posterColPrefix + 'Street Address']: posterBasicInfo['street_address'],
                      [posterColPrefix + 'City']: posterBasicInfo['city'],
                      [posterColPrefix + 'State']: statesData[posterBasicInfo['state_id'] || null],
                      [posterColPrefix + 'Zipcode']: posterBasicInfo['zipcode'],
                      [posterColPrefix + 'Phone Number']: posterBasicInfo['phone_number'],
                      [posterColPrefix + 'Firm Name']: posterBasicProfile['firm_name'],
                      [posterColPrefix + 'Firm Title']: posterBasicProfile['title'],
                      [posterColPrefix + 'Practice Locations']: '',
                      [posterColPrefix + 'Practice Areas']: '',
                      [posterColPrefix + 'Interested In Hiring']: '',
                      [posterColPrefix + 'Website Url']: posterBasicProfile['website_url'],
                      'Created At': _getFormattedDate(temp['created_at']),
                      'Updated At': _getFormattedDate(temp['updated_at'])
                    };
                    var eduArr = [];
                    seekerBasicProfile['education'].forEach(function(item) {
                      var eduDetail = (item['school']) + sepObj.multiColSeperator + (degreeData[item['degree_id'] || null] || '') + sepObj.multiColSeperator + (item['year']) + sepObj.multiColSeperator + (item['education_additional_information']);
                      eduArr.push(eduDetail)
                    });
                    result[seekerColPrefix + 'Education'] = eduArr.join(sepObj.multiColMultiValSeperator);

                    var barArr = [];
                    seekerBasicProfile['bar_admission'].forEach(function(item) {
                      var barDetail = (statesData[item['bar_state_id'] || null] || '') + sepObj.multiColSeperator + (item['bar_registration_number']);
                      barArr.push(barDetail);
                    });
                    result[seekerColPrefix + 'State Licensure'] = barArr.join(sepObj.multiColMultiValSeperator);

                    var pracAreaArr = [];
                    seekerBasicProfile['practice_area_id'].forEach(function(item) {
                      pracAreaArr.push(practiceAreasData[item || null] || '');
                    });
                    result[seekerColPrefix + 'Practice Areas'] = pracAreaArr.join(sepObj.multiValSeperator);

                    var skillArr = [];
                    seekerBasicProfile['skill_used_id'].forEach(function(item) {
                      skillArr.push(skillsData[item || null] || '');
                    });
                    result[seekerColPrefix + 'Skills'] = skillArr.join(sepObj.multiValSeperator);

                    var expArr = [];
                    seekerInfo['experience'].forEach(function(item) {
                      var empTypeArr = [], skillArr = [], dateArr = [];
                      item['employment_type_id'].forEach(function(empType) {
                        empTypeArr.push(employmentTypeData[empType || null] || '');
                      });

                      item['skill_used_id'].forEach(function(skillUsed){
                        skillArr.push(skillsData[skillUsed || null] || '');
                      });

                      dateArr.push(_getFormattedDate(item['start_date']));
                      // console.log('----> ',dateArr)
                      item['start_date'] && !item['end_date'] ? dateArr.push('Present') : dateArr.push(_getFormattedDate(item['end_date']));

                      var expDetail = (item['company_name']) + sepObj.multiColSeperator + (item['designation']) + sepObj.multiColSeperator + (item['present'] || defaultVal) + sepObj.multiColSeperator + (dateArr.join(sepObj.multiValSeperator)) + sepObj.multiColSeperator + (empTypeArr.join(sepObj.multiValSeperator)) + sepObj.multiColSeperator + (item['experience_additional_information']) + sepObj.multiColSeperator + (skillArr.join(sepObj.multiValSeperator)) + sepObj.multiColSeperator + (item['others'] || '');
                      expArr.push(expDetail);
                    });
                    result[seekerColPrefix + 'Experience'] = expArr.join(sepObj.multiColMultiValSeperator);

                    var samplesArr = [];
                    seekerNetwork['writing_samples'].forEach(function(item) {
                      item && samplesArr.push((s3BucketPath + item['path']));
                    });
                    result[seekerColPrefix + 'Writing Samples Link'] = samplesArr.join(sepObj.multiValSeperator);

                    var locArr = [];
                    seekerJobProfile['willing_to_work_location_id'].forEach(function(item) {
                      locArr.push(statesData[item || null] || '');
                    });
                    result[seekerColPrefix + 'Work Location Locally'] = locArr.join(sepObj.multiValSeperator);

                    seekerJobProfile['desired_job_type'].forEach(function(item) {
                      if (employmentTypeData[item['employment_type_id']] === 'Permanent') {
                        result[seekerColPrefix + 'Desired Job Type - Permanent'] = item['selected'];
                        result[seekerColPrefix + 'Desired Job Min Amount - Permanent'] = ratePrefix + item['min_amount'];
                        result[seekerColPrefix + 'Desired Job Max Amount - Permanent'] = ratePrefix + item['max_amount'];
                      } else {
                        result[seekerColPrefix + 'Desired Job Type - Contract'] = item['selected'];
                        result[seekerColPrefix + 'Desired Job Min Amount - Contract'] = ratePrefix + item['min_amount'];
                        result[seekerColPrefix + 'Desired Job Max Amount - Contract'] = ratePrefix + item['max_amount'];
                      }
                    });

                    var pracLocArr = [];
                    posterBasicProfile['practice_location_id'].forEach(function(item) {
                      pracLocArr.push(statesData[item || null] || '');
                    });
                    result[posterColPrefix + 'Practice Locations'] = pracLocArr.join(sepObj.multiValSeperator);

                    var pracArr = []
                    posterBasicProfile['practice_area_id'].forEach(function(item) {
                      pracArr.push(practiceAreasData[item]);
                    });
                    result[posterColPrefix + 'Practice Areas'] = pracArr.join(sepObj.multiValSeperator);

                    var categArr = [];
                    posterBasicProfile['intrested_in_id'].forEach(function(item) {
                      categArr.push(categoriesData[item || null] || '');
                    });
                    result[posterColPrefix + 'Interested In Hiring'] = categArr.join(sepObj.multiValSeperator);

                    finalResult.push(result);
                  });

                  jsonexport(finalResult, {headerPathString : ""}, function(err, csv){
                    if(err) return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
                    return res.send(csv);
                  });
                } else {
                  return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
                }
              });

          } else {
            return res.json({Code:401, Status:false, Message:CONST.INVALID_CREDENTIALS});
          }
        } else {
          return res.json({Code:401, Status:false, Message:CONST.INVALID_CREDENTIALS});
        }
      }
    });
  } else {
    return res.json({Code:401, Status:false, Message:CONST.AUTH_FAIL});
  }
}

function exportPostJobs(req, res, callback) {
  var statesData = {},
  employmentTypeData = {},
  workLocData = {},
  userData = {};

  if (!!req.headers.token) {
    commonMethod.checkUserLoggedIn(req.headers.token , function(err, result){
      if (err) {
        return res.json({Code: 400, Status: false, Message: CONST.err});
      } else {
        if (result) {
          if (result.role == "admin") {
              state.getDropdown({}, function(err, result) {
              if (err) return console.log(err);
              result.forEach(function(item) {
                statesData[item._id] = item.name;
              })
            });

            employment_type.getDropdown({}, function(err, result) {
              if (err) return console.log(err);
              result.forEach(function(item) {
                employmentTypeData[item._id] = item.name;
              })
            });

            setting.getDropdown({}, function(err, result) {
              if (err) return console.log(err);
              result.forEach(function(item) {
                workLocData[item._id] = item.name;
              })
            });

            var queryObj = {
              'query': {'role': 'user'},
              'options': {'email': 1, 'job_posters_info.job_post_id': 1}
            }
            users.findQuery(queryObj, function(err, resp) {
              if (err) {
                callback(resObj);
              } else {
                var postJobIdArr = [];
                resp.map(function(r){
                  // console.log(r['_doc']);
                  userData[r['_doc']['_id']] = r['_doc']['email'];
                  r['_doc']['job_posters_info']['job_post_id'] && postJobIdArr.push(r['_doc']['job_posters_info']['job_post_id']);
                })

              var queryObj = {
                'query': { "_id":{$in:postJobIdArr}},
                'sortOption': {'created_at': 1}
              }

                post_job.findQuery(queryObj, function(err, pRes) {
                  if(!err){
                    var finalResult = [];
                    pRes.map(function(r){
                      var temp = r._doc;
                      var ratePrefix = _getRatePrefix();
                      var sepObj = _getSeperatorObj();
                      var result = {
                        'User Email': userData[temp['userId']],
                        'Job Headline': temp['jobHeadline'],
                        'Practice Areas': '',
                        'Skills Needed': '',
                        'Job Description': temp['jobDescription'],
                        'City': temp['city'],
                        'State': statesData[temp['state'] || null] || '',
                        'Zip Code': temp['zipCode'],
                        'Location': workLocData[temp['setting_id'] || null] || '',
                        'Estimated Start Date': _getFormattedDate(temp['estimatedStartDate']) || 'ASAP',
                        'Estimated Duration - Amount': temp['duration'],
                        'Estimated Duration - Days': temp['durationPeriod'] === 'days' ? 'Y' : 'N',
                        'Estimated Duration - Weeks': temp['durationPeriod'] === 'weeks' ? 'Y' : 'N',
                        'Estimated Duration - Months': temp['durationPeriod'] === 'months' ? 'Y' : 'N',
                        'Target Rate - Amount': ratePrefix + temp['rate'],
                        'Target Rate - Hourly': temp['rateType'] === 'HOURLY' ? 'Y' : 'N',
                        'Target Rate - Fixed': temp['rateType'] === 'FIXED' ? 'Y' : 'N',
                        'Estimated Hours - Amount': temp['hours'],
                        'Estimated Hours - Part-Time': employmentTypeData[temp['hoursType']] === 'Part-time' ? 'Y' : 'N',
                        'Estimated Hours - Full-Time': employmentTypeData[temp['hoursType']] === 'Full-time' ? 'Y' : 'N',
                        'Amount Payable': ratePrefix + temp['subTotal'],
                        'Payment And Deliverable Schedule': '',
                        'Service Charge': ratePrefix + Number(temp['total'] - temp['subTotal']).toFixed(2),
                        'Estimated Total Cost': ratePrefix + temp['total'],
                        'Created At': _getFormattedDate(temp['created_at']),
                        'Updated At': _getFormattedDate(temp['updated_at'])
                      };

                      var pracArr = []
                      temp['practiceArea'].forEach(function(item) {
                        pracArr.push(item.name);
                      });
                      result['Practice Areas'] = pracArr.join(sepObj.multiValSeperator);

                      var skillArr = [];
                      temp['skillsNeeded'].forEach(function(item) {
                        skillArr.push(item.name);
                      });
                      result['Skills Needed'] = skillArr.join(sepObj.multiValSeperator);

                      var paymentArr = [];
                      temp['paymentDetails'].forEach(function(item) {
                        var paymentDetail = (ratePrefix + item['rate']) + sepObj.multiColSeperator + (item['delivery']) + sepObj.multiColSeperator + _getFormattedDate(item['dueDate']);
                        paymentArr.push(paymentDetail);
                      });
                      result['Payment And Deliverable Schedule'] = paymentArr.join(sepObj.multiColMultiValSeperator);

                      finalResult.push(result);
                    });

                  jsonexport(finalResult, {headerPathString : ""}, function(err, csv){
                    if(err) return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
                    return res.send(csv);
                  });
                } else {
                  return res.json({Code:400, Status:false,Message:CONST.OOPS_ERROR});
                }
                });
              }
            })
          } else {
            return res.json({Code:401, Status:false, Message:CONST.INVALID_CREDENTIALS});
          }
        } else {
          return res.json({Code:401, Status:false, Message:CONST.INVALID_CREDENTIALS});
        }
      }
    });
  } else {
    return res.json({Code:401, Status:false, Message:CONST.AUTH_FAIL});
  }
}

module.exports = {
  exportUsers,
  exportPostJobs
}
