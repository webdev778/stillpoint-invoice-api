import Store from './Store.js';

var executeHttpRequest = function(method, url, data, headers, callback) {

    var obj = {
        xhrFields: {
            withCredentials: true
        },
        method: method,
        url: url,
        data: data,
        dataType: 'json'
    };
    
    if(headers){
        obj.headers = headers;
    }
    
    $.ajax(obj).done(function(result, b, c) {
        result.status = true;
        callback(result);
    }).fail(function(xhr, status, error) {
        var result = {};
        result.status = false;
        callback(result);
    });
}

var API_URL = {
    //GET_HOURS_TYPE: '/getEmploymentType',
    GET_HOURS_TYPE:'/getEstHourType',
    GET_STATES: '/getState',
    GET_SKILLS: '/getSkills',
    GET_PRACTICE_AREA: '/getPracticeArea',
    GET_JOB: '/getJob',
    GET_JOB_LIST: '/getJob/list',
    GET_JOB_SETTINGS:'/getSettings',
    GET_JOB_CURRENT_RATE:'/getCurrentRate',
    GET_JOB_HIRE:'/getInterestedInHiring',
    POST_JOB: '/postJob'
}

var HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
}

var fetchHoursType = function(callback) {
    var hoursType = Store.getHoursType();
    if(hoursType.length) {
        return callback({status: true, Data: hoursType});
    }
    executeHttpRequest(HTTP_METHODS.GET, API_URL.GET_HOURS_TYPE, null, null, function(response) {
        if(response.status) {
            Store.setHoursType(response.Data);
        }
        callback(response);
    });
}

var fetchStates = function(callback) {
    var states = Store.getStates();
    if(states.length) {
        return callback({status: true, Data: states});
    }
    executeHttpRequest(HTTP_METHODS.GET, API_URL.GET_STATES, null, null, function(response) {
        if(response.status) {
            Store.setStates(response.Data);
        }
        callback(response);
    });
}

var fetchPracticeArea = function(callback) {
    var practiceArea = Store.getPracticeArea();
    if(practiceArea.length) {
        return callback({status: true, Data: practiceArea});
    }
    executeHttpRequest(HTTP_METHODS.GET, API_URL.GET_PRACTICE_AREA, null, null, function(response) {
        if(response.status) {
            Store.setPracticeArea(response.Data);
        }
        callback(response);
    });
}



var fetchSkillsNeeded = function(callback) {
    var skills = Store.getSkills();
    if(skills.length) {
        return callback({status: true, Data: skills});
    }
    executeHttpRequest(HTTP_METHODS.GET, API_URL.GET_SKILLS, null, null, function(response) {
        if(response.status) {
            Store.setSkills(response.Data);
        }
        callback(response);
    });
}

var fetchSettings = function(callback){
 var skills;
 executeHttpRequest(HTTP_METHODS.GET, API_URL.GET_JOB_SETTINGS, null, null, function(response) {
     if(response.status) {
           return callback({status: true, Data: response.Data});
     }
     callback(response);
 });   
}

var fetchCurrentRate = function(callback){

  executeHttpRequest(HTTP_METHODS.GET, API_URL.GET_JOB_CURRENT_RATE, null, null, function(response) {
      if(response.status) {
            return callback({status: true, Data: response.Data});
      }
      callback(response);
  });  
}

var fetchInterestedHire = function(callback){
   executeHttpRequest(HTTP_METHODS.GET, API_URL.GET_JOB_HIRE, null, null, function(response) {
       if(response.status) {
             return callback({status: true, Data: response.Data});
       }
       callback(response);
   });  
}
module.exports = {
    executeHttpRequest: executeHttpRequest,
    API_URL: API_URL,
    HTTP_METHODS: HTTP_METHODS,
    fetchHoursType: fetchHoursType,
    fetchStates: fetchStates,
    fetchPracticeArea: fetchPracticeArea,
    fetchSkillsNeeded: fetchSkillsNeeded,
    fetchSettings:fetchSettings,
    fetchCurrentRate:fetchCurrentRate,
    fetchInterestedHire:fetchInterestedHire
}
