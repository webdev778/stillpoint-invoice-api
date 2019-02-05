'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var UserSchema = new Schema({
  first_name: {type: String, required: true, maxlength: 50},
  last_name: {type: String, required: true, maxlength: 50},
  email: {type: String, unique: true, required: true, lowercase: true},
  password: {type: String, required: true, minlength: 8},
  job_seeker_info: {
    basic_profile:{
      basic_info:{
        street_address: {type: String, default:''},
        city: {type: String, default:''},
        state_id: {type: String, default:''},
        zipcode: {type: String, default:''},
        phone_number: {type: String, default:''},
      },
      education: [{
       school: {type: String, default:''},
       degree_id: {type: String, default:''},
       degree_others: {type:String, default:''},
       year: {type:String, default:''},
       education_additional_information: {type:String, default:''}
      }],
      bar_admission: [{
        bar_state_id : {type:String, default:''},
        bar_registration_number : {type:Number, default:null}
      }],
      practice_area_id: {type : Array},
      skill_used_id: {type: Array},
      others : {type:String},
      showOthers : {type:String},
      present : {type:String},
      do_you_have_malpractice_insurance: {type: String, default:'N'}
    },
    experience:[{
      company_name: {type: String, default:''},
      designation: {type: String, default:''},
      current_employer: {type: String, default:''},
      start_date: {type: Date},
      end_date: {type: Date},
      employment_type_id: {type: Array},
      skill_used_id: {type: Array},
      experience_additional_information: {type:String},
      others : {type:String},
      showOthers : {type:String},
      present : {type:String}
    }],
    network: {
      photo : {type: String},
      lawyer_headline: {type: String, default:''},
      about_lawyer: {type: String, default:''},
      linkedin_link: {type: String, default:''},
      resume: {type: String},
      writing_samples: {type:Array},
    },
    job_profile:{
      willing_to_work_locally: {type: String, default:'Y'},
      willing_to_work_location_id: {type: Array},
      willing_to_work_remotely: {type: String},
      willing_to_work_full_time: {type: String},
      willing_to_work_part_time: {type: String},
      desired_job_type: [
        {
         employment_type_id: {type: String},
         min_amount: {type: Number},
         max_amount: {type: Number},
         selected : {type:String}
        }
     ]
   },
   is_profile_completed: {type: String, default:'N'},
   last_visited_page: {type: Number, default:0}
  },
  job_posters_info : {
    basic_profile:{
     basic_info:{
        street_address: {type: String, default:''},
        city: {type: String, default:''},
        state_id: {type: String, default:''},
        zipcode: {type: String, default:''},
        phone_number: {type: String, default:''},
      },
      firm_name: {type: String},
      title: {type: String},
      practice_location_id: {type : Array},
      practice_area_id: {type : Array},
      intrested_in_id: {type: Array},
      website_url: {type: String},
    },
    job_post_id : {type:String, default: ''},
    is_profile_completed: {type: String, default:'N'},
    last_visited_page: {type: Number, default: 0},
  },
  last_visited_profile : {type: String,default : "job_seeker_info"},
  role: {type: String, default: 'user'},
  status: {type: String, default: 'Y'},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}

});


UserSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.statics.comparePassword = function(userPassword, dbPassword, callback) {
  // console.log(userPassword, dbPassword)
    bcrypt.compare(userPassword, dbPassword, function(err, isMatch) {
      if (err) return callback(err);
      callback(null, isMatch);
    });
};

UserSchema.statics.signupUser = function(data,callback) {
    this.create(data,callback);
};

UserSchema.statics.findByEmail = function(email,callback) {
  // var emailId = new RegExp(["^", email, "$"].join(""), "i");
  // console.log(emailId);
  this.findOne({email:email},callback);
};

UserSchema.statics.findById = function(id,callback) {
    this.findOne({_id:id},callback);
};

UserSchema.statics.encryptPassword = function(password,callback) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return callback(err);

        bcrypt.hash(password, salt, function(err, hash){
            if(err) return callback(err);

            // password = hash;
             callback(null, hash);
            // next();
        });
    });
};

UserSchema.statics.updatePassword = function(user_id,password,callback) {
  this.findOneAndUpdate({_id:user_id},{$set:{password:password}},{upsert:false},callback);
};


UserSchema.statics.findProfile = function(user_id, key, nestedKey, data, step, callback) {
  this.findOne({_id:user_id},{_id:0},function(err, result){
    if(err){
      callback(err);
    }else{
      result[key]['last_visited_page'] = step;
      if(step == 4){
        result[key]['is_profile_completed'] = 'Y';
      }
      result['last_visited_profile'] = key;
      result[key][nestedKey] = data;
      callback(null, result);
    }
  });
};

UserSchema.statics.updateProfile = function(user_id,data,callback) {
  this.findOneAndUpdate({_id:user_id},{$set:data},{upsert:false},callback);
};

UserSchema.statics.updatePostJob = function(user_id,job_post_id,callback) {
  // console.log("inside updatePostJob", user_id, job_post_id)
  this.findOneAndUpdate({_id:user_id},{$set:{"job_posters_info.job_post_id" : job_post_id, "job_posters_info.last_visited_page" : 2, "job_posters_info.is_profile_completed": 'Y',"last_visited_profile":"job_posters_info"}},{upsert:false},callback);
};


UserSchema.statics.uploadImage = function(){
  this.insert(newItem, function(err, result){
   if (err) { console.log(err); };
      var newoid = new ObjectId(result.ops[0]._id);
      fs.remove(req.file.path, function(err) {
         if (err) { console.log(err) };
         res.render('index', {title:'Thanks for the Picture!'});
         });
      });
}


UserSchema.statics.findQuery = function(queryObj = {}, callback) {
  this.find(queryObj.query || {}, queryObj.options || {}).sort(queryObj.sortOption).exec(callback);
};


//export our module to use in user.js
module.exports = mongoose.model('User', UserSchema);


var forgotPassSchema = new Schema({
  user_id: {type: ObjectId},
  forgot_token: {type: String},
  created_at : {type: Date, default : Date.now}
});

// This will insert the new record if no record is exit for email id otherwise it will updated the old one.
forgotPassSchema.statics.saveData = function(data,callback) {
    this.update({user_id:data.user_id}, data, {upsert: true}, callback);
};

forgotPassSchema.statics.findByToken = function(token,callback) {
    this.findOne({forgot_token:token},callback);
};

forgotPassSchema.statics.removeEntry = function(id,callback) {
    this.remove({_id: id}, callback);
};

module.exports = mongoose.model('forgotPassword', forgotPassSchema);

