'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/******************* State Schema **********************************/

var stateSchema = new Schema({
  name: {type: String},
  abbrev: {type: String},
  status:{type: Boolean, default:true}
});


stateSchema.statics.getDropdown = function(data,callback){
  this.find(data,callback);
}


module.exports = mongoose.model('state', stateSchema);

/******************* Degree Schema **********************************/

var degreeSchema = new Schema({
  name: {type: String},
  status:{type: Boolean, default:true}
});


degreeSchema.statics.getDropdown = function(data,callback){
  this.find(data,callback);
}


module.exports = mongoose.model('degree', degreeSchema);


/******************* Employment Schema **********************************/

var employmentTypeSchema = new Schema({
  name: {type: String},
  status:{type: Boolean, default:true}
});


employmentTypeSchema.statics.getDropdown = function(data,callback){
  console.log("data  :", data);
  this.find(data,callback);
}

employmentTypeSchema.statics.findJobType = function(id,callback){
  this.findOne({_id : id},callback);
  // console.log("id" , id, callback);
}


module.exports = mongoose.model('employment_type', employmentTypeSchema);


/******************* Skills Schema **********************************/

var skillsSchema = new Schema({
  name: {type: String},
  status:{type: Boolean, default:true}
});


skillsSchema.statics.getDropdown = function(data,callback){
  this.find(data,callback);
}


module.exports = mongoose.model('skills', skillsSchema);


/******************* Practic Area Schema **********************************/

var practiceAreaSchema = new Schema({
  name: {type: String},
  status:{type: Boolean, default:true}
});


practiceAreaSchema.statics.getDropdown = function(data,callback){
  this.find(data,callback);
}


module.exports = mongoose.model('practice_area', practiceAreaSchema);


/******************* Settings Schema **********************************/

var settingSchema = new Schema({
  name: {type: String},
  status:{type: Boolean, default:true}
});


settingSchema.statics.getDropdown = function(data,callback){
  this.find(data,callback);
}


module.exports = mongoose.model('setting', settingSchema);


/******************* interested in hiring Schema **********************************/

var hiringSchema = new Schema({
  name: {type: String},
  status:{type: Boolean, default:true}
});


hiringSchema.statics.getDropdown = function(data,callback){
  this.find(data,callback);
}


module.exports = mongoose.model('interested_in_hiring', hiringSchema);


/******************* Rate Setting Schema **********************************/

var rateSettingSchema = new Schema({
  currentRate: {type: Number},
  created: {type: Date, default: Date.now},
  modified: {type: Date, default: Date.now}
});


rateSettingSchema.statics.getCurrentRate = function(data,callback){
  this.findOne(data,callback);
}


module.exports = mongoose.model('rate_setting', rateSettingSchema);
