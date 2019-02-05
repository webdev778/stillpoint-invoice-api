import React from 'react';
import { Link,browserHistory} from 'react-router';
import Datetime from 'react-datetime';
import moment from 'moment';
var Multiselect = require('react-widgets').Multiselect;
import TopContent from './topContent.jsx';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import WebService from '../common/WebService.js';
import Util from '../common/Util.js';
import {ENUM} from '../common/Util.js';
import Select from 'react-select';
import Popup from './popup.jsx';
import ProfileBulletPoster from './profileBulletsPoster.jsx';
import {ApiCall} from '../server/config/util.js';
import cookieManager from '../common/cookieManager';
import CONST from '../common/Const.js';

class PostJob extends React.Component{

    constructor (props) {

        super(props);

        this.state = {
            job: {
                jobHeadline:'',
                practiceArea: [],
                skillsNeeded:[],
                jobDescription:'',
                city:'',
                state:'',
                zipCode:'',
                estimatedStartDate:'',
                duration:'',
                durationPeriod: ENUM.DURATION_PERIOD.DAYS,
                rate:'',
                rateType: ENUM.RATE_TYPE.HOURLY,
                hours:'',
                hoursType: '',
                subTotal: '',
                total: '',
                remainingAmount: '',
                paymentDetails: [
                    {rate: '', delivery: '',dueDate:''}
                   /* {rate: '', delivery: '',dueDate:''}*/
                ],
                setting_id: '',
                currentRate:'',
                newJobPost:true,
            },
            diableHours: false,
            formError: {},
            hoursTypeArr: [],
            statesArr: [],
            practiceAreaArr: [],
            skillsNeededArr: [],
            settingsList:[],
            seekeractive : 'tab-btn-white',
            posteractive : 'tab-btn-blue',
            zipErr: '',
            editProfile : false,
            loaded:true,
            legablyChargesForFixed : 0,
            resSuccess : false,
            resError : false,
            message : '',
            profileComplete : false,
            firstName : '',
            lastName : ''

        };

        this.changeInput = this.changeInput.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.validateLength = this.validateLength.bind(this);
        this.validateAndCalculateAmount = this.validateAndCalculateAmount.bind(this);
        this.calculateAmount = this.calculateAmount.bind(this);
        this.removePaymentDetail = this.removePaymentDetail.bind(this);
        this.addPaymentDetail = this.addPaymentDetail.bind(this);
        this.setPaymentDetails = this.setPaymentDetails.bind(this);
        this.calculateRemainingAmount = this.calculateRemainingAmount.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.onChangeHoursType = this.onChangeHoursType.bind(this);
        this.setStateKeyVal = this.setStateKeyVal.bind(this);
        this.gotoHome = this.gotoHome.bind(this);
        this.handleDueDate = this.handleDueDate.bind(this);
        this.fetchHoursType = this.fetchHoursType.bind(this);
        this.fetchStates = this.fetchStates.bind(this);
        this.fetchPracticeArea = this.fetchPracticeArea.bind(this);
        this.fetchSkillsNeeded = this.fetchSkillsNeeded.bind(this);
        this.fetchSettings = this.fetchSettings.bind(this);
        this.fetchCurrentRate = this.fetchCurrentRate.bind(this);
        this.saveAndPreviewJob = this.saveAndPreviewJob.bind(this);
        this.getUserProfile = this.getUserProfile.bind(this);
        this.getjobPost = this.getjobPost.bind(this);
    }

    componentDidMount() {
        $('.job-posting-card').on('keydown', '.custom-num', function(evt) {
            var evtKey = (evt.key).toLowerCase();
            if ( evtKey == '.' || evtKey == 'decimal') {
                return ($(this).val().indexOf('.') == -1);
            }
        });

        var _this = this;
        this.setState({seekeractive : 'tab-btn-white'});
        this.setState({posteractive : 'tab-btn-blue'});

        this.fetchStates();
        this.fetchCurrentRate();
        this.fetchPracticeArea();
        this.fetchSkillsNeeded();
        this.fetchHoursType();
        this.fetchSettings();
        this.getUserProfile();

        var jobId = this.props.location.query.jobId;
        // console.log('jobId ===> ', jobId);

        var stateObj = this.state.job;

        if(jobId) {

            // fetchData from store or fetchData from API

            // dummy data remove this as soon as integrate API.
            this.setState({job: {
                "jobHeadline": "Lawyer - IP Litigation",
                "practiceArea": [{
                    "name": "Admiralty and Maritime Law",
                    "status": true
                }],
                "skillsNeeded": [{
                    "name": "Legal Writing",
                    "status": true
                }],
                "jobDescription": "In volutpat ultrices ornare. Curabitur convallis ligula lorem, quis rhoncus mi efficitur ac. Mauris dictum sagittis auctor. Donec porttitor vel magna sed faucibus. Aenean blandit, mauris non dignissim aliquam, sapien sem sodales tortor, ac tincidunt sapien nunc efficitur lorem. Nullam feugiat felis ligula, at ultrices eros euismod eu. Nam ut ante sed dolor suscipit mattis. Phasellus justo erat, convallis a scelerisque non, vehicula id nunc. In non malesuada dui. Pellentesque habitant morbiquess. <br/><br/>Integer sed mattis risus, sit amet tempor augue. Suspendisse varius felis sed ipsum commodo, vel euismod urna euismod. Fusce id libero ac mauris iaculis porttitor. Phasellus consectetur orci et quam rutrum, non scelerisque mi ornare. Curabitur efficitur dolor at tempor cursus. Curabitur arcu lacus, semper eget vulputate a, blandit non felis. Donec volutpat, augue non dignissim auctor, dolor enim scelerisque quam, ac pellentesque felis est a justo.",
                "city": "Ny",
                "state": "59B93483334B84460A958DBD",
                "zipCode": 12345,
                "estimatedStartDate": "09/06/2017",
                "duration": 11,
                "durationPeriod": "weeks",
                "rate": 10,
                "rateType": "HOURLY",
                "hours": 10,
                "hoursType": "partTime",
                "subTotal": 100,
                "total": 115,
                "paymentDetails": [{
                    "rate": 100,
                    "delivery": "1st delivery",
                    "dueDate": ""
                }/*, {
                    "rate": 15,
                    "delivery": "2nd delivery",
                    "dueDate" :""
                }*/]
            }});
        }
    }

    gotoHome () {
        var baseUrl = location.origin + '/home';
        var url= Util.insertParam(arr);
        url = Util.removeParam("jobId", url);
        url = Util.removeParam("pSec", url);
        Util.changeUrl(baseUrl + url);
    }

    showModal (id, show) {
        if(show) {
            $('#'+id).modal('show');
        } else {
            $('#'+id).modal('hide');
        }
    }

    setStateKeyVal (key, val) {
        var obj = {};
        obj[key] = val;

        this.setState(obj);
    }

    changeInput (ev, key) {
        var val = ev.target.value;
        //val = val.trim();
        var stateObj = this.state.job;
        stateObj[key] = val;

        this.setState({job: stateObj});
  	}

    handleOnBlur (ev, key) {

        var formError = this.state.formError;
        var val = ev.target.value;

        formError[key] = false;
        if(!val){
            formError[key] = true;
        }
        if(key =='zipCode'){
         if(val){
            var text = /^[0-9]+$/;
            if(val.length == 5 ){
               if (!text.test(val)) {
                  this.setState({zipErr:CONST.INVALID_ZIPCODE}) ;
                  formError[key] = true;
                }
                else{
               this.setState({zipErr:''})
                }
            }
           else {
              this.setState({zipErr:CONST.INVALID_ZIPCODE});
              formError[key] = true;
           }
           }
            else{
              this.setState({zipErr:CONST.ENTER_ZIPCODE});
              formError[key] = true;
            }

        }

        this.setState({formError: formError});
  	}

    handleMultiSelectOnBlur (ev, key) {

        var formError = this.state.formError;
        var val = this.state.job[key];

        formError[key] = false;

        if(!val.length){
            formError[key] = true;
        }

        this.setState({formError: formError});
  	}

    setMultiSelectValues (val, key) {

        var formError = this.state.formError;
        var stateObj = this.state.job;
        var _this = this;
        stateObj[key] = val;

        this.setState({job: stateObj},function(){
            if(!stateObj[key].length){
              if(key == 'practiceArea')
               formError[key] = 'Please select practice area';
              else if(key == 'skillsNeeded')
               formError[key] = 'Please select skills needed';
            }
            else{
                formError[key] = '';
            }
          _this.setState({formError});
        });
  	}

    handleStartDateChange (date) {

        var stateObj = this.state.job;

        date = moment.isMoment(date) ? date.format("MM/DD/YYYY"): date;

        stateObj.estimatedStartDate = date;

        this.setState({job: stateObj});

    }
    handleDueDate (date,index){

       let stateObj = Object.assign({}, this.state.job);

       date = moment.isMoment(date) ? date.format("MM/DD/YYYY"): date;

       stateObj.paymentDetails[index].dueDate = date;

       this.setState({job: stateObj});
    }
    validateLength (ev, key, maxValue) {
        var val = ev.target.value + '';

        var maxLen = String(maxValue).length;

        if(ev.target.name == 'zipCode') {
    /*        var text = /^[0-9]+$/;
            if(val.length == 5){
             if (!text.test(value)) {
                fieldValidationErrors.zipcode = CONST.INVALID_ZIPCODE;

              }
              else{
               fieldValidationErrors.zipcode ="";
               }
            }
            else{

              fieldValidationErrors.zipcode = CONST.INVALID_ZIPCODE;

            }
            if(ev.target.name != 'zipCode')
            val = val.substr(0, (maxValue+'').length);*/

        }
        else{
         val = val.replace(/[^0-9.]/g, "");
            val = val.substr(0, (maxValue+'').length);
        }



        var stateObj = this.state.job;
//        stateObj[key] = Number(val);
        stateObj[key] = val;

        this.setState({job: stateObj});
    }

    fetchCurrentRate(){
        var _this = this;
        WebService.fetchCurrentRate(function(response) {
            if(!response.status) {
                // handle error
            } else {
                var stateObj = _this.state.job;
                if(response.Data) {
                    //alert(response.Data.currentRate);
                    stateObj.currentRate = Number(response.Data.currentRate);
                }
                _this.setState({job: stateObj});
            }
        });
    }

    fetchHoursType () {
        var _this = this;
        WebService.fetchHoursType(function(response) {
            if(!response.status) {
                // handle error
            } else {
                var stateObj = _this.state.job;
                if(response.Data && response.Data.length) {
                    stateObj.hoursType = response.Data[0]._id;
                }
                _this.setState({hoursTypeArr: response.Data || [], job: stateObj});
            }
        });
    }

    fetchStates () {
        var _this = this;
        WebService.fetchStates(function(response) {
            if(!response.status) {
                // handle error
            } else {
                _this.setState({statesArr: response.Data || []});
            }
        });
    }

    fetchSettings(){
       var _this = this;
       WebService.fetchSettings(function(response) {
           if(!response.status) {
               // handle error
           } else {
               _this.setState({settingsList : response.Data || []});
           }
       });
    }

    fetchPracticeArea () {
        var _this = this;
        WebService.fetchPracticeArea(function(response) {
            if(!response.status) {
                // handle error
            } else {
                response.Data.forEach((practiceArea) => {
                    practiceArea.label = practiceArea.name;
                    practiceArea.value = practiceArea._id;
                });
                _this.setState({practiceAreaArr: response.Data || []});
            }
        });
    }

    fetchSkillsNeeded () {
        var _this = this;
        WebService.fetchSkillsNeeded(function(response) {
            if(!response.status) {
                // handle error
            } else {

                response.Data.forEach((practiceArea) => {
                    practiceArea.label = practiceArea.name;
                    practiceArea.value = practiceArea._id;
                });
                _this.setState({skillsNeededArr: response.Data || []});
            }
        });
    }

    onChangeHoursType (ev, key) {
        var stateObj = this.state.job;
        if ( ENUM.RATE_TYPE.FIXED == stateObj.rateType ) {
            stateObj.hours = '';
        }
        this.changeInput(ev, key);
        this.calculateAmount();
    }

    validateAndCalculateAmount (ev, key, limit) {
        this.validateLength(ev, key, limit);
        this.calculateAmount();
    }

    calculateAmount () {
        var _this = this;
        var stateObj = this.state.job;
        var paymentDetail = stateObj.paymentDetails;
        var formError = this.state.formError;
        paymentDetail.forEach((payment) => {
            //payment.rate = 0;
        });

        setTimeout(function() {
            var subtotal = ENUM.RATE_TYPE.FIXED == stateObj.rateType ? (stateObj.rate || 0) : (stateObj.rate || 0) * (stateObj.hours || 0);
        //    alert(stateObj.currentRate)
            isNaN(subtotal) && (subtotal = 0);
            stateObj.subTotal = parseFloat(subtotal).toFixed(2);
            var total = parseFloat(stateObj.subTotal) + parseFloat(parseFloat(stateObj.subTotal * stateObj.currentRate / 100).toFixed(2));

            stateObj.total = total;
            _this.setState({ legablyChargesForFixed : parseFloat(subtotal * stateObj.currentRate/100).toFixed(2)});
            if(ENUM.RATE_TYPE.FIXED == stateObj.rateType) {
                stateObj.hours = 0

                _this.setStateKeyVal('diableHours', true);

                formError.hours = false;


            } else {
                _this.setStateKeyVal('diableHours', false)
            }


            stateObj.paymentDetails = [{rate: '', delivery: '',dueDate:''}];
            _this.setState({formError});
            _this.setState({job: stateObj});
            _this.calculateRemainingAmount();
        });
    }

    calculateRemainingAmount (index,key) {
        var stateObj = this.state.job;

        var paymentDetail = stateObj.paymentDetails;
        var total = stateObj.subTotal;
        var totalRate = 0;

        paymentDetail.forEach((payment) => {
            !isNaN(payment.rate) && (totalRate += Number(payment.rate || 0));
        });

        var remainingAmount = parseFloat(total - totalRate);

        if(remainingAmount < 0) {
            remainingAmount = 0;
            paymentDetail.forEach((payment) => {
              payment.errorMessage = 'Rate should not exceed the total amount';
                //payment.rate = 0;
            });
            if(key && index){
           //   paymentDetail[index][key] = parseFloat(0);
            }

        }else{
            paymentDetail.forEach((payment) => {
              payment.errorMessage = '';
            });
        }

        var stateObj = this.state.job;
        stateObj.remainingAmount = (parseFloat(remainingAmount)).toFixed(2);

        this.setState({job: stateObj});
    }

    removePaymentDetail (index) {
        var stateObj = this.state.job;

        var paymentDetail = stateObj.paymentDetails;
        paymentDetail.splice(index, 1);

        stateObj.paymentDetails = paymentDetail;
        this.setState({job: stateObj});
        this.calculateRemainingAmount();
    }

    addPaymentDetail () {
        var stateObj = this.state.job;

        var paymentDetail = stateObj.paymentDetails;
        paymentDetail.push({rate: '', delivery: '',dueDate:''});

        stateObj.paymentDetails = paymentDetail;
        this.setState({job: stateObj});
        this.calculateRemainingAmount();
    }

    setPaymentDetails (ev, key, index) {
        var stateObj = this.state.job;

        var val = ev.target.value;
        (key != 'delivery') && (val = val.replace(/[^0-9.]/g, ""));
        var paymentDetail = stateObj.paymentDetails;
        var totalRate = 0;
        var prevVal = paymentDetail[index][key];

        paymentDetail.forEach((payment) => {
            payment.errorMessage = '';
        });
        // delete paymentDetail[index].errorMessage;

        if(key == 'delivery') {
            paymentDetail[index][key] = val;

            stateObj.paymentDetails = paymentDetail;
            this.setState({job: stateObj});

            return;
        }

        if(stateObj.total === '') {
//            alert('Please Fill rate and hours.');
            paymentDetail[index].errorMessage = 'Please fill rate and hours';

            stateObj.paymentDetails = paymentDetail;
            this.setState({job: stateObj});
            return;
        }

        paymentDetail[index][key] = val;

        paymentDetail.forEach((payment) => {
            !isNaN(payment.rate) && (totalRate += Number(payment.rate || 0));
        });

        if(Number(parseFloat(totalRate).toFixed(2)) > Number(stateObj.subTotal)) {
            //paymentDetail[index][key] = parseFloat(prevVal || 0);
            paymentDetail.forEach((payment) => {
                payment.errorMessage = 'Rate should not exceed the total amount';
            });
            // paymentDetail[index].errorMessage = 'Rate should not exceed the total amount';
        }

        stateObj.paymentDetails = paymentDetail;
        this.setState({job: stateObj});

        this.calculateRemainingAmount(index,key);
    }

    validateForm (job) {
        var validForm = true;
        var formError = this.state.formError;
        var jobState = this.state.job;

        for(var key in job) {

            if(key == 'estimatedStartDate') {
                continue;
            }

            if(Array.isArray(job[key])) {

                if(!job[key].length) {

                    formError[key] = true;
                    validForm = false;
                }
            } else {
                if(key =='zipCode'){
                           // if(job[key]){

                            if(key =='zipCode'){
                               if(job[key]){
                                var text = /^[0-9]+$/;
                                if(job[key].length == 5 ){
                                   if (!text.test(job[key])) {
                                      this.setState({zipErr:CONST.INVALID_ZIPCODE}) ;
                                      formError[key] = true;
                                    }
                                    else{
                                   this.setState({zipErr:''})
                                    }
                                }
                               else {
                                  this.setState({zipErr:CONST.INVALID_ZIPCODE});
                                  formError[key] = true;
                               }
                               }
                                else{
                                  this.setState({zipErr:CONST.ENTER_ZIPCODE});
                                  formError[key] = true;
                                }

                            }

                }
                else{
                  if(!job[key] && typeof(job[key]) != "number") {
                      formError[key] = true;
                      validForm = false;
                  } else {
                      formError[key] = false;


                  }
                }

            }
        }

        var paymentDetails = this.state.job.paymentDetails;

    /*    paymentDetails = paymentDetails.filter((payment, index) => {
            if(index > 1) {
                return payment.rate && payment.delivery;
            }
            return payment;
        })*/

        paymentDetails.forEach(function(paymentDetail,index) {
            if(!paymentDetail.rate && index == 0){
                validForm = false;
                paymentDetail.errorMessage = 'Please enter Rate';

            } else {

                if(paymentDetail.errorMessage){
                    formError[key] = true;
                    validForm = false;
                }

         //       delete paymentDetail.errorMessage;
            }
        });



        jobState.paymentDetails = paymentDetails;

        this.setState({formError: formError});
        this.setState({job: jobState});

        return validForm;
    }

    saveAndPreviewJob () {
        var id = null
        var baseUrl = location.origin + '/previewJob';
        var arr = [{'key':"jobId",'value': id || 1234567890}, {key: 'pSec', value: 'true'}];
        var url= Util.insertParam(arr);
        url = Util.removeParam("jobId", url);
        Util.changeUrl(baseUrl+ url);
    }
//'/getPostJob/:jobId'

    getUserProfile(){

    let that = this;
    var job = this.state.job;
    var token = Util.getToken();
    ApiCall('get','/getUserProfile/job_posters_info/job_seeker_info',{},token, function(err, response){
      if(err){
        console.log("error : ",err)
      }else{
        if(response.data.Code == 200 && response.data.Status == true){
          var data = response.data.Data;
           var userData = Util.getUserData();
              if(userData){
                userData.first_name = response.data.Data.first_name;
                userData.last_name = response.data.Data.last_name;
                that.setState({firstName : response.data.Data.first_name, lastName : response.data.Data.last_name});
                cookieManager.setCookie('userData', JSON.stringify(userData));
              }
          if(data.job_posters_info.is_profile_completed == 'Y'){
            that.setState({editProfile : true, profileComplete : true});
          }else{
            that.setState({editProfile : false, profileComplete : false});
          }
          that.setState({completeStatus:data.job_posters_info.last_visited_page});
          var job_post_id = data.job_posters_info.job_post_id;
          if(job_post_id){
            that.state.job.newJobPost = false;
            that.getjobPost(job_post_id);
          }

        }else {
          console.log(response.data.Message);

        }
      }
    })
   }

    getjobPost(id){
        let that = this;
        var job = this.state.job;
        var token = Util.getToken();
        ApiCall('get','/getPostJob/'+id,{},token, function(err, response){
          if(err){
            console.log("error : ",err)
          }else{
            if(response.data.Code == 200 && response.data.Status == true){
                var data = response.data.Data;
                job = data;
                job.estimatedStartDate = (data.estimatedStartDate) ? moment.parseZone(data.estimatedStartDate).format('MM/DD/YYYY') : '';
                if(data.paymentDetails.length == 0){
                    job.paymentDetails = [{rate: '', delivery: '',dueDate:''}];
                }
                data.paymentDetails.map((payment,index)=>{
                    job.paymentDetails[index].dueDate = (payment.dueDate)? moment.parseZone(payment.dueDate).format('MM/DD/YYYY') : '';
                });

                that.setState({legablyChargesForFixed : parseFloat(data.subTotal * job.currentRate/100).toFixed(2)})
                that.setState({job},function(){
                    that.calculateRemainingAmount();
                });
            }else {
              console.log(response.data.Message);

            }
          }
        })
    }

    postJob (e) {
        e.preventDefault();
        e.stopPropagation();
        var _this = this;
        var job = this.state.job;
        let callFrom = e.target.name;
       /* job.practiceArea = job.practiceArea.map((practiceArea) => {
            return practiceArea._id
        });

        job.skillsNeeded = job.skillsNeeded.map((skills) => {
            return skills._id
        });*/

        var validForm = this.validateForm(job);

        if(!validForm){
           // $('html, body').animate({scrollTop:0}, 'slow');
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        job.hours = Number(job.hours);
        job.rate = Number(job.rate);
        job.zipCode = job.zipCode;

        job.status = 'POST';
        var headers = {token: Util.getToken()}
        _this.setState({loaded:false},function(){
          WebService.executeHttpRequest(WebService.HTTP_METHODS.POST, WebService.API_URL.POST_JOB, job, headers, function(response) {
            //  alert(response.Message);

              if(!response.Status) {
                  // handle Error
                _this.setState({loaded:true});
              } else {

                 // browserHistory.push('/post-job-thank-you');
                Util.showHideFlashMsg();
                  if(callFrom == "save")
                  {
                      _this.setState({resSuccess : true, resError: false, message : CONST.SUCCESS_UPDATE_PROFILE});
                    // Util.refreshPage();
                    _this.setState({loaded:true});
                    _this.getUserProfile();
                  }else{
                    Util.changeUrl('/post-job-thank-you');
                    _this.setState({loaded:true});
                  }

              }
          });
        });


    }

    render(){
        var _this = this;
        var job = this.state.job;

        const validStartDate = (current) => {

            let currentDate = new Date();
            if (!currentDate)
                return true;
            const yesterday = moment(currentDate).subtract(1, "days");
            return current.isAfter(yesterday);

        };

	      return (
              <div>
                  <Commonheader firstName = {this.state.firstName} lastName = {this.state.lastName}></Commonheader>
                  <div className="job-detail-page content-wrapper container">

                  <TopContent active={this.state.seekeractive} inactive={this.state.posteractive} thisObj={this} showP = {Util.showpop} headTitle="Post Job" content="Next, please provide details regarding the job you'd like to post on Legably."/>

                   <div className="visible-xs mobile-page-heading">Post Job<span onClick={()=>Util.changeUrl("/post-job-thank-you")} className={this.state.completeStatus >= 2 ? 'next' : 'next disabled-element'}></span> </div>

                   <ProfileBulletPoster currentProfilePage="2" completeStatus={this.state.completeStatus} profileComplete = {this.state.profileComplete}/>



                  <div className="job-posting-card card">
                        <h4>Job Details</h4>

                        <div className={this.state.formError.jobHeadline ? 'form-group global-error' : 'form-group' }>

                            <label className="control-label">job headline*</label>

                            <input name="jobHeadline" className="form-control" placeholder="Job Headline" type="text"  maxLength="150" value={job.jobHeadline} onChange={(e) => this.changeInput(e, 'jobHeadline')} onBlur={(e)=>this.handleOnBlur(e, 'jobHeadline')}/>

                            {this.state.formError.jobHeadline ? <p><span> Please enter job headline </span></p> : ''}

                        </div>

                        <div className="row">
                            <div className="col-sm-6">
                                <div className={this.state.formError.practiceArea ? 'form-group global-error' : 'form-group' }>

                                    <label className="control-label">PRACTICE AREA(S)*</label>
                                    <Select
                                        multi
                                        onBlurResetsInput = {true}
                                        autosize = {false}
                                        onChange={(val) => this.setMultiSelectValues(val, 'practiceArea')}
                                        options={this.state.practiceAreaArr}
                                        placeholder="Select Practice Area(s)"
                                        value={job.practiceArea}
                                    />
                                    {this.state.formError.practiceArea ? <p><span> Please select practice area </span></p> : ''}
                                </div>
                            </div>

                            <div className="col-sm-6">
                                <div className={this.state.formError.skillsNeeded ? 'form-group global-error' : 'form-group' }>

                                    <label className="control-label">Skills Needed*</label>

                                    <Select
                                        multi
                                        onBlurResetsInput = {true}
                                        autosize = {false}
                                        onChange={(val) => this.setMultiSelectValues(val, 'skillsNeeded')}
                                        options={this.state.skillsNeededArr}
                                        placeholder="Select Skill(s) Needed"
                                        value={job.skillsNeeded}

                                    />

                                    {this.state.formError.skillsNeeded ? <p><span> Please select skills </span></p> : ''}
                                </div>
                            </div>
                        </div>


<div className="row d-none">
        <div className="col-sm-4">
          <div className={this.state.formError.practiceArea ? 'form-group global-error' : 'form-group' }>

            <label className="control-label">PRACTICE AREA(S)*</label>
            <Select
            multi
            onBlurResetsInput = {true}
            autosize = {false}
            onChange={(val) => this.setMultiSelectValues(val, 'practiceArea')}
            options={this.state.practiceAreaArr}
            placeholder="Select Practice Area(s)"
            value={job.practiceArea}
            />
            {this.state.formError.practiceArea ? <p><span> Please select practice area </span></p> : ''}
          </div>
        </div>

        <div className="col-sm-4">
          <div className={this.state.formError.skillsNeeded ? 'form-group global-error' : 'form-group' }>

            <label className="control-label">Skills Needed*</label>

            <Select
            multi
            onBlurResetsInput = {true}
            autosize = {false}
            onChange={(val) => this.setMultiSelectValues(val, 'skillsNeeded')}
            options={this.state.skillsNeededArr}
            placeholder="Select Skill(s) Needed"
            value={job.skillsNeeded}

            />

            {this.state.formError.skillsNeeded ? <p><span> Please select skills </span></p> : ''}
          </div>
        </div>

        <div className="col-sm-4">
          <div className={this.state.formError.skillsNeeded ? 'form-group global-error' : 'form-group' }>
            <label className="control-label">Others</label>
            <input name="others" className="form-control" placeholder="Others" type="text" />
          </div>
        </div>
      </div>



                        <div className={this.state.formError.jobDescription ? 'form-group global-error' : 'form-group' }>

                            <label className="control-label">JOB DESCRIPTION*</label>

                            <textarea name="jobDescription" className="form-control" maxLength="2000"  placeholder="Type your description here" value={job.jobDescription} onChange={(e) => this.changeInput(e, 'jobDescription')} onBlur={(e)=>this.handleOnBlur(e, 'jobDescription')}></textarea>

                            {this.state.formError.jobDescription ? <p><span> Please enter job description </span></p> : ''}
                        </div>

                        <div className="row">
                            <div className="col-sm-4">
                                <div className={this.state.formError.city ? 'form-group global-error' : 'form-group' }>

                                    <label className="control-label">City*</label>

                                    <input name="city" className="form-control" placeholder="City" type="text" value={job.city} onChange={(e) => this.changeInput(e, 'city')} onBlur={(e)=>this.handleOnBlur(e, 'city')}/>

                                    {this.state.formError.city ? <p><span> Please enter city </span></p> : ''}
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className={this.state.formError.state ? 'form-group global-error' : 'form-group' }>

                                    <label className="control-label">State*</label>

                                    <select name="state" className="form-control" value={job.state} onChange={(e) => this.changeInput(e, 'state')} onBlur={(e)=>this.handleOnBlur(e, 'state')}>
                                        <option value="">Select state</option>
                                        {this.state.statesArr.map((state) =>
                                            <option key={state.name} value={state['_id']}>{state.name}</option>
                                        )}
                                    </select>

                                    {this.state.formError.state ? <p><span> Please select state </span></p> : ''}
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className={this.state.formError.zipCode ? 'form-group global-error' : 'form-group' }>
                                    <label className="control-label">Zip Code*</label>

                                    <input name="zipCode" className="form-control" placeholder="Zip Code" type="text" value={job.zipCode} onChange={(e) => this.validateLength(e, 'zipCode', 99999)} onBlur={(e)=>this.handleOnBlur(e, 'zipCode')}/>

                                    {this.state.formError.zipCode ? <p><span> {this.state.zipErr} </span></p> : ''}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className={this.state.formError.setting_id ? 'form-group global-error' : 'form-group' }>

                                    <label className="control-label">Location*</label>

                                    <select name="setting_id" className="form-control txt-transform-none" value={job.setting_id} onChange={(e) => this.changeInput(e, 'setting_id')} onBlur={(e)=>this.handleOnBlur(e, 'setting_id')}>
                                        <option value="">Select Location</option>
                                        {this.state.settingsList.map((settings) =>
                                            <option key={settings.name} value={settings['_id']}>{settings.name}</option>
                                        )}
                                    </select>



                                 { /*  <Select
                                        multi
                                        onBlurResetsInput = {true}
                                        autosize = {false}
                                         onChange={(val) => this.setMultiSelectValues(val, 'skillsNeeded')}
                                        options={this.state.skillsNeededArr}
                                        placeholder="Select Practice Setting"
                                        value={job.skillsNeeded}
                                    />*/}

                                    {this.state.formError.setting_id ? <p><span> Please select location </span></p> : ''}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label className="control-label">Estimated Start date</label>
                                    <Datetime onChange={(date)=>this.handleStartDateChange(date)}
                                        value ={job.estimatedStartDate}
                                        input={true}
                                        inputProps={{placeholder:'ASAP',name:'searchStartDate',readOnly:true}}
                                        name = 'start_date'
                                        closeOnSelect ={true}
                                        dateFormat={'MM/DD/YYYY'}
                                        timeFormat={false}
                                        isValidDate={ validStartDate }
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="posting-two-cols">
                          <div className='form-group'>

                              <label className="control-label">ESTIMATED DURATION OF ENGAGEMENT*</label>
                              <div className={this.state.formError.duration ? 'global-error d-inline-block' : 'd-inline-block' }>
                              <input name="duration" className="form-control custom-num" placeholder="00" type="text" value={job.duration} onChange={(e) => this.validateLength(e, 'duration', 999)} onBlur={(e)=>this.handleOnBlur(e, 'duration')}/>

                              {this.state.formError.duration ? <p><span> Please enter duration </span></p> : ''}
                              </div>
                              <ul className="tabbed-radio-btns three-tabs">
                                <li>
                                  <input type="radio" name="d-w-m" checked={job.durationPeriod == ENUM.DURATION_PERIOD.DAYS ? 1 : 0} value={ENUM.DURATION_PERIOD.DAYS} onClick={(e) => this.changeInput(e, 'durationPeriod')}/>
                                    <span>Days</span>
                                </li>
                                <li>
                                  <input type="radio" name="d-w-m" value={ENUM.DURATION_PERIOD.WEEKS} checked={job.durationPeriod == ENUM.DURATION_PERIOD.WEEKS ? 1 : 0}  onClick={(e) => this.changeInput(e, 'durationPeriod')}/>
                                    <span>Weeks</span>
                                </li>
                                <li>
                                  <input type="radio" name="d-w-m" value={ENUM.DURATION_PERIOD.MONTHS} checked={job.durationPeriod == ENUM.DURATION_PERIOD.MONTHS ? 1 : 0}  onClick={(e) => this.changeInput(e, 'durationPeriod')}/>
                                    <span>Months</span>
                                </li>
                              </ul>
                          </div>
                        </div>

                        <div className="posting-two-cols">
                          <div className='form-group'>

                              <label className="control-label">TARGET RATE*</label>
                              <div className={this.state.formError.rate ? 'global-error d-inline-block' : 'd-inline-block' }>
                              <input className="form-control amount-dollar-bg text-left custom-num" placeholder="Rate" type="text" value={job.rate} onChange={(e) => this.validateAndCalculateAmount(e, 'rate', 999999)} onBlur={(e)=>this.handleOnBlur(e, 'rate')}/>

                              {this.state.formError.rate ? <p><span> Please enter rate </span></p> : ''}
                              </div>
                              <ul className="tabbed-radio-btns">
                                  <li>
                                      <input type="radio" name="h-f" checked={job.rateType == ENUM.RATE_TYPE.HOURLY ? 1 : 0} value={ENUM.RATE_TYPE.HOURLY} onClick={(e) => this.onChangeHoursType(e, 'rateType')}/>
                                      <span>Hourly</span>
                                  </li>
                                  <li>
                                      <input type="radio" name="h-f" checked={job.rateType == ENUM.RATE_TYPE.FIXED ? 1 : 0} value={ENUM.RATE_TYPE.FIXED} onClick={(e) => this.onChangeHoursType(e, 'rateType')}/>
                                      <span>Fixed</span>
                                  </li>
                              </ul>
                          </div>
                        </div>

                        <div className="posting-two-cols hours-col">
                          <div className='form-group'>
                            <label className="control-label">ESTIMATED HOURS OF WORK REQUIRED*</label>
                             <div className={this.state.formError.hours && job.rateType != ENUM.RATE_TYPE.FIXED ? 'global-error d-inline-block' : 'd-inline-block' }>

                            <input className="form-control custom-num" placeholder="00" type="text" value={job.hours} onChange={(e) => this.validateAndCalculateAmount(e, 'hours', 999)} onBlur={(e)=>this.handleOnBlur(e, 'hours')} disabled={this.state.diableHours}/>
                            {this.state.formError.hours ? <p><span> Please enter hours </span></p> : ''}
                            </div>
                            <div className="pt-ft-w-m">
                              <ul className="tabbed-radio-btns">

                                {this.state.hoursTypeArr.map((hoursType, index) =>
                                  <li key={index}>
                                      <input type="radio" name="pt-ft" checked={hoursType._id == job.hoursType ? 1 : 0} value={hoursType._id} onClick={(e) => this.changeInput(e, 'hoursType')} disabled={this.state.diableHours}/>
                                      <span>{hoursType.name}</span>
                                  </li>
                              )}

                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="separator"></div>

                        <div className="estimated-section">
                          <h5>Estimated Amount Payable to Selected Candidate</h5>
                          <p>Based on the information you have provided, the estimated amount payable to your selected candidate is indicated below.</p>
                          <div className="row">
                            <div className="col-sm-4">
                              <div className="form-group">
                                <label className="control-label">AMOUNT PAYABLE</label>
                                <input className="form-control amount-dollar-bg" placeholder="Total" type="text" value={job.subTotal} disabled="true"/>
                              </div>
                            </div>
                            {/*<div className="col-sm-6">
                              <div className="form-group">
                                <label className="control-label">Total</label>
                                <input className="form-control" placeholder="Total" type="text" value={job.total} disabled="true"/>
                                <p className="payable">Payable to Legably</p>
                              </div>
                            </div>*/}
                          </div>

                          <div className="separator"></div>

                          <h5>Estimated Payment and Deliverable Schedule</h5>
                          <p>The estimated payment and deliverable schedule allows you to disperse the estimated amount payable to your selected candidate over the course of your project or task based upon the completion of specific deliverables. If there is only one deliverable, simply allocate the estimated amount payable to your selected candidate to that single item. </p>
                          <ul className="hidden-xs row mb-0">
                            <li className="col-sm-4">
                              <label className="control-label">Amount Payable*</label>
                            </li>
                            <li className="col-sm-4">
                              <label className="control-label">On Delivery Of</label>
                            </li>
                            <li className="col-sm-4">
                              <label className="control-label">Due Date</label>
                            </li>
                          </ul>

                          {job.paymentDetails.map((paymentDetail, index) =>
                            <ul className="payment-details row" key={index}>
                                <li className={paymentDetail.errorMessage ? 'global-error col-sm-4' : 'col-sm-4' }>
                                  <span className="hidden visible-xs">Amount Payable*</span>
                                  <input className="amount-dollar-bg custom-num" type="text" placeholder="Payment" value={paymentDetail.rate} onChange={(e) => this.setPaymentDetails(e, 'rate', index)}/>
                                  <p><span>{paymentDetail.errorMessage || ''}</span></p>
                                </li>
                                <li className="col-sm-4">
                                  <span className="hidden visible-xs">On Delivery Of</span>
                                  <input type="text" className="form-control" placeholder="Deliverable Description" value={paymentDetail.delivery} onChange={(e) => this.setPaymentDetails(e, 'delivery', index)}/>
                               {/* <p><span>{paymentDetail.errorMessage || ''}</span></p>*/}
                                </li>
                                <li className='col-sm-4'>
                                  <span className="hidden visible-xs">Due Date</span>
                                  <Datetime onChange={(date)=>this.handleDueDate(date,index)}
                                      value ={paymentDetail.dueDate}
                                      input={true}
                                      inputProps={{placeholder:'Due Date',name:'searchStartDate',readOnly:true}}
                                      name = 'start_date'
                                      closeOnSelect ={true}
                                      dateFormat={'MM/DD/YYYY'}
                                      timeFormat={false}
                                      isValidDate={ validStartDate }
                                  />

                                </li>

                                    { (job.paymentDetails.length > 0  && index!=0) ?
                                      <p className="less">
                                          <i className="fa fa-minus-circle" onClick={(e) => this.removePaymentDetail(index)}></i>
                                          <span>Delete</span>
                                      </p> :
                                      <p></p>
                                  }

                                  { (job.paymentDetails.length > 0 && index == job.paymentDetails.length-1 && job.remainingAmount != 0) ?
                                      <p className="add-more" >
                                          <i className="fa fa-plus-circle" onClick={(e) => this.addPaymentDetail()}></i>
                                          <span>Add More</span>
                                      </p> :
                                      <p></p>
                                  }
                              </ul>
                          )}
                          <div className="separator"></div>

                          <ul className="remaining-detail">
                              <li>
                              <label className="control-label">REMAINDER TO BE ALLOCATED </label>
                               <span className="hidden visible-xs">Rate</span>
                              <input type="text" className="form-control amount-dollar-bg" placeholder="Remaining" value={job.remainingAmount} disabled="true"/>
                              </li>
                          </ul>

                          <div className="separator"></div>

                          <h5>Estimated Total Cost</h5>
                          <p>The estimated total cost of this engagement is indicated below. Please note that this amount is subject to change pending final agreed upon terms negotiated between you and the candidate. Once you have agreed to terms with your candidate and are ready to move forward, the actual total cost will be due and placed in escrow, payable to your candidate per the final agreed upon payment and deliverable schedule.</p>
                          <p>
                            <span className="pull-left">Estimated amount payable to selected candidate:</span>
                            <span className="pull-right">{isNaN((parseFloat(job.subTotal)).toFixed(2))? "$00.00" : '$'+job.subTotal}</span>
                            <div className="clear-both"></div>
                          </p>
                          <p>
                            <span className="pull-left">Estimated Legably service charge:</span>
                            <span className="pull-right">{ isNaN((parseFloat(this.state.legablyChargesForFixed)).toFixed(2)) ? '$0.00' : '$'+this.state.legablyChargesForFixed}</span>
                            <div className="clear-both"></div>
                          </p>
                          <p className="separator clear-both"></p>
                          <p className="clear-both grand-total">
                            <span className="pull-left">Estimated total cost</span>
                            <span className="pull-right">{isNaN((parseFloat(job.total)).toFixed(2)) ? '$00.00' : '$'+parseFloat(job.total).toFixed(2)}</span>
                            <div className="clear-both"></div>
                          </p>
                        </div>

                      </div>
                      <div className="nxt-prev-btns">
                        <button type="click" onClick={()=>Util.changeUrl("/post-job-basic-information")} className="previouse-btn btn pull-left mb-10">Previous</button >
                         <div className={this.state.editProfile == true ? "d-block" : "d-none"}>
                            <button type="button" name="save&Next" className="nxt-btn btn-blue btn pull-right" onClick={(e) => this.postJob(e)}> Save & Next </button >
                            <button type="button" name="save" className="nxt-btn btn-blue btn pull-right mr-1p" onClick={(e) => this.postJob(e)}> Save </button >
                            <button type="button" className="nxt-btn btn-white btn pull-right mr-1p" onClick={()=>Util.refreshPage()}> Cancel </button>
                          </div>
                          <button type="submit" name="save&Next" className={this.state.editProfile == true ? "d-none nxt-btn btn pull-right" : "d-block nxt-btn btn-blue btn pull-right"} onClick={(e) => this.postJob(e)}> Next </button >
                        <span className="clear-fix"></span>
                      </div>

                </div>

                  <div className="create-new-job-modal modal fade in" id="confirmPostJob" role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                          <div><img src="/images/svg-IMAGES/ok.svg" alt="upload-doc" className="img-responsive create-job-ok-icon" /></div>
                          <p>Your Job has been posted Successfully.</p>
                          <h2>Do you want to create a new job?</h2>
                        </div>
                        <div className="modal-footer">
                          <button className="btn-default btn" data-dismiss="modal" onClick={this.gotoHome}>No</button>
                          <button className="btn-blue btn"  data-dismiss="modal">Yes</button>
                        </div>
                      </div>
                    </div>


                  </div>
            {this.state.showPopup ?
              <Popup
                url={'/post-job-details'}
                content={CONST.POPUP_MSG} obj={this}
              />
              : null
            }
                <Commonfooter></Commonfooter>
                <div className={this.state.loaded ? 'fade-layer d-none' : 'fade-layer'}>
                 <div className="loader"></div>
                </div>
                 {this.state.resSuccess == true ? (<div className="alert alert-success fixed-alert"> {this.state.message}</div>) : ''}
            {this.state.resError == true ? (<div className="alert alert-danger fixed-alert">{this.state.message}</div>): ''}
              </div>
      	)

	  }

}



export default PostJob;
