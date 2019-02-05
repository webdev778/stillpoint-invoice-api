'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;


//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var postJobSchema = new Schema({
  jobHeadline: {type: String, required: true, maxlength: 150},
  practiceArea: {type : Array},
  skillsNeeded: {type: Array},
  others : {type:String},
  showOthers : {type:String},
  present : {type:String},
  jobDescription: {type: String, required: true,maxlength:2000},
  city: {type: String},
  state: {type: String},
  zipCode: {type: String, required:true},
  setting_id: {type: String},
  estimatedStartDate: {type: Date},
  duration: {type: Number},
  durationPeriod: {type:String},
  rate: {type: Number},
  rateType: {type: String},
  hours: {type: Number},
  hoursType: {type: String},
  subTotal: {type: String},
  total: {type: String},
  currentRate : {type: Number},
  paymentDetails: [
    {
     rate: {type: Number},
     delivery: {type: String},
     dueDate: {type:Date}
    }
 ],
  userId : {type: ObjectId},
  status: {type: String},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
  createdBy : {type:String}

});

postJobSchema.statics.saveData = function(data,callback) {
  this.create(data,callback);
};

postJobSchema.statics.UpdateQuery = function(id, data,callback) {
  this.findOneAndUpdate({_id: id}, {$set: data}, {upsert: false}, callback);
};

postJobSchema.statics.getJobData = function(data,callback) {
  this.findOne(data,callback);
};

postJobSchema.statics.findQuery = function(queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {}).sort(queryObj.sortOption).exec(callback);
};


module.exports = mongoose.model('post_job', postJobSchema);

