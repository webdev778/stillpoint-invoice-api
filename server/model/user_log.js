'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var loginDataSchema = new Schema({
  user_id: {type: ObjectId},
  token: {type: String},
  status:{type: Boolean, default:false}
});


loginDataSchema.statics.saveData = function(data,callback){
  this.create(data,callback);
}

loginDataSchema.statics.findByToken = function(token,callback) {
    this.findOne({token:token},callback);
};

loginDataSchema.statics.findByUserId = function(user_id,callback) {
    this.findOne({user_id:user_id},callback);
};

loginDataSchema.statics.removeEntry = function(id,callback) {
	// console.log(token)
    this.remove({_id:id},callback);
};

module.exports = mongoose.model('user_log', loginDataSchema);

