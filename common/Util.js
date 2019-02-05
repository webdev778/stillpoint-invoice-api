import cookieManager from '../common/cookieManager';
import { browserHistory } from 'react-router';
import {ApiCall} from '../server/config/util.js';
// import Util from '../common/Util.js';

var job_seeker_info = {
  "0" : "/attorney-profile-basic-info",
  "1" : "/attorney-profile-experience",
  "2" : "/attorney-profile-headline",
  "3" : "/attorney-profile-job-type"
}

var job_posters_info = {
  "0" : "/post-job-basic-information",
  "1" : "/post-job-details",

}

var getValFromCookie = function(key) {
	if(document.cookie.indexOf(key)>=0){
  	return JSON.parse(cookieManager.getCookie(key));
	}else{
		return '';
	}
}

var getUserData = function() {
  var userData = getValFromCookie('userData');
  return userData;
}

var getToken = function() {
  var userData = getUserData();
  if(userData){
    return userData.token;
  }else{
    return '';
  }
}

var rememberMeFunc = function(){
  if(document.cookie.indexOf('rememeberMe')>=0){
    let remMe = JSON.parse(cookieManager.getCookie('rememeberMe'));
    cookieManager.deleteAllCookies();
    cookieManager.setCookie('rememeberMe', JSON.stringify(remMe));
  }else{
    cookieManager.deleteAllCookies();
  }
  changeUrl('/sign-in');
}

var changeUrl = function (url) {
    browserHistory.push(url);
}

var insertParam = function (arr) {

    var location = document.location.search;
    var loc = '';
    for (var j = 0; j < arr.length; j++) {
        var key = arr[j].key;
        var value = arr[j].value;
        key = escape(key);
        value = escape(value);
        var kvp = location.substr(1).split('&');
        if (kvp == '') {
            loc = '?' + key + '=' + value;
        } else {
            var i = kvp.length;
            var x;
            while (i--) {
                x = kvp[i].split('=');
                if (x[0] == key) {
                    x[1] = value;
                    kvp[i] = x.join('=');
                    break;
                }
            }
            if (i < 0) {
                kvp[kvp.length] = [key, value].join('=');
            }
            loc = '?' + kvp.join('&');
        }
        location = loc;
    }
    return location;
}
var removeParam = function (key, url) {

    var rtn = ""
        , param
        , params_arr = []
        , queryString = url;
    if (queryString) {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = params_arr.join("&");
    }
    return rtn;
}

// ENUMs
var DURATION_PERIOD = {
    DAYS: 'days',
    WEEKS: 'weeks',
    MONTHS: 'months',
}

var RATE_TYPE = {
    HOURLY: 'HOURLY',
    FIXED: 'FIXED',
}

var HOURS_TYPE = {
    PARTTIME: 'partTime',
    FULLTIME: 'fullTime',
}
var name;
var whiteOrBlue;

var getValFromLocalStore = function(key) {
    return window.localStorage[key]
}

var showpop = function(obj,_this,submitted,_url){

   console.log(obj.target.className)
   if(!submitted){
       name = obj.target.name;
       whiteOrBlue = obj.target.className.indexOf('white')>=0;
       if(_url){
        navigateBtWTabs(_this,_url);
       }
     else if(whiteOrBlue && name == 'seeker'){
       _this.setState({showPopup:true},function(){
         $('#myPopup').modal('show');
       });
     }
     else if(whiteOrBlue && name == 'poster'){
      _this.setState({showPopup:true},function(){
        $('#myPopup').modal('show');
     });

    }
   }

}



//Function for mandatory fields
/*
var isMandatory = function(fieldValidationErrors,fieldName,value,index,label,type,objName){
     if(type == 'b'){   // on blur
          if(!value){
                if(index){
                    fieldValidationErrors[objName][index][fieldName] = ' Please enter your '+ label;
                }
                else{
                    fieldValidationErrors[objName][index][fieldName] = ' Please enter your '+ label;
                }
              }
              else{
                fieldValidationErrors[objName][index][fieldName] = '';
              }
        }
     else{ // on submit
         for(var key in fieldValidationErrors){
             if(!value){
                   if(index){
                       fieldValidationErrors[objName][index][fieldName] = ' Please enter your '+ label;
                   }
                   else{
                       fieldValidationErrors[objName][index][fieldName] = ' Please enter your '+ label;
                   }
                 }
                 else{
                   fieldValidationErrors[objName][index][fieldName] = '';
                 }
          }
        }

}*/
/*var isMandatory = function(job,formError) {
    var validForm = true;
    for(var key in job) {

        if(key == 'estimatedStartDate') {
            continue;
        }
        if(Array.isArray(job[key])) {
            if(!job[key].length) {
                isMandatory(job[key],formError[key]);
                formError[key] = true;
                validForm = false;
            }

        } else {
            if(!job[key] && typeof(job[key]) != "number") {
                formError[key] = true;
                validForm = false;
            } else {
                formError[key] = false;
            }
        }
    }
    return validForm;
}*/

function goToPage(result){
  cookieManager.deleteCookie('fromButton');
  if(result.last_visited_profile == 'job_seeker_info'){
    cookieManager.setCookie('seekeractive','tab-btn-blue');
    cookieManager.setCookie('posteractive','tab-btn-white');
    if(result['job_seeker_info'].is_profile_completed == 'Y'){

      changeUrl("/attorney-profile-get-started");
    }else{
      changeUrl(job_seeker_info[result.job_seeker_info.last_visited_page]);
    }
  }else if(result.last_visited_profile == 'job_posters_info'){
    cookieManager.setCookie('seekeractive','tab-btn-white');
    cookieManager.setCookie('posteractive','tab-btn-blue');
    if(result['job_posters_info'].is_profile_completed == 'Y'){

      changeUrl("/post-job-thank-you");

    }else{
      changeUrl(job_posters_info[result.job_posters_info.last_visited_page]);
    }
  }
}

var redirectionHandle = function(){
  if (getUserData()['role'] === 'admin') {
    changeUrl('/admin-dashboard');
  } else {
    ApiCall('get','/getUserProfile/job_seeker_info/job_posters_info',{},getToken(), function(err, response){
      if(!err){
        if(response.data.Code == 200 && response.data.Status == true){
          var result = response.data.Data;
          var redirectToPage = getValFromCookie('fromButton');
          if(!!redirectToPage && redirectToPage.homeButton == 'post-job-details'){
            result.last_visited_profile = "job_posters_info";
            goToPage(result);
          }else if(!!redirectToPage && redirectToPage.homeButton == 'find-job'){
            result.last_visited_profile = "job_seeker_info";
            goToPage(result);
          }else{
            goToPage(result);
          }
        }else{
         console.log("error : ",response.data.Message)
        }
      }
    });
  }
}


var navigateBtWTabs = function(obj,url){
  var tempurl;
  if(whiteOrBlue && name == 'seeker'){
   cookieManager.setCookie('fromButton',JSON.stringify({"homeButton":"find-job"}));
   redirectionHandle();
   /*obj.setState({'seekeractive':'tab-btn-blue'});
   obj.setState({'posteractive':'tab-btn-white'});
   cookieManager.setCookie('seekeractive','tab-btn-blue');
   cookieManager.setCookie('posteractive','tab-btn-white');
   browserHistory.push(url);*/
  }
  else if(whiteOrBlue && name == 'poster'){
   cookieManager.setCookie('fromButton',JSON.stringify({"homeButton":"post-job-details"}));
   redirectionHandle();
/*   obj.setState({'seekeractive':'tab-btn-white'});
   obj.setState({'posteractive':'tab-btn-blue'});
   cookieManager.setCookie('seekeractive','tab-btn-white');
   cookieManager.setCookie('posteractive','tab-btn-blue');
   browserHistory.push(url);*/
  }
  $('#myPopup').modal('hide');
}


  var refreshPage = function(){
    window.location.reload();
   }

   var showHideFlashMsg = function(){
      $('.fixed-alert').show();
     setTimeout(function() {
       $('.fixed-alert').hide();
      }, 5000 );
   }

 var getDate = function() {
  var date = new Date();
  var dd = ('0' + date.getDate()).slice(-2);
  var mm = ('0' + (date.getMonth() + 1)).slice(-2);
  return (dd + mm + date.getFullYear());
 }

 var getTime = function() {
  var date = new Date();
  var hh = ('0' + date.getHours()).slice(-2);
  var mm = ('0' + date.getMinutes()).slice(-2);
  var ss = ('0' + date.getSeconds()).slice(-2);
  return (hh + mm + ss);
 }

module.exports = {
	getUserData : getUserData,
	getValFromCookie: getValFromCookie,
	getToken: getToken,
    rememberMeFunc: rememberMeFunc,
    changeUrl: changeUrl,
    insertParam: insertParam,
    removeParam: removeParam,
    ENUM: {
        DURATION_PERIOD: DURATION_PERIOD,
        RATE_TYPE: RATE_TYPE,
        HOURS_TYPE: HOURS_TYPE
    },
    getValFromLocalStore: getValFromLocalStore,
    showpop:showpop,
    navigateBtWTabs:navigateBtWTabs,
    name :name,
    whiteOrBlue : whiteOrBlue,
    redirectionHandle : redirectionHandle,
    refreshPage : refreshPage,
    showHideFlashMsg : showHideFlashMsg,
    getDate: getDate,
    getTime: getTime
   // isMandatory : isMandatory
}


