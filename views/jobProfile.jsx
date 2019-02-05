import React from 'react';
import {ApiCall} from '../server/config/util.js';
import { Link, browserHistory } from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import ProfileBullet from './profileBullets.jsx';
import cookieManager from '../common/cookieManager';
import Util from '../common/Util.js';
import Select from 'react-select';
import CONST from '../common/Const.js';
import Popup from './popup.jsx';
import TopContent from './topContent.jsx';


class JobProfile extends React.Component {
  constructor (props) {
    super(props);
       this.state = {
        submitted:'',
        options:[],
        stateId:[],
        seekeractive : 'tab-btn-blue',
        posteractive : 'tab-btn-white',
        state_name:'',
        showPopup : false,
        work_permanent:'N',
        work_contract:'N',
        loaded:true,
        resError : false,
        resSuccess : false,
        message : '',
        formErrors:{willing_to_work_location_id:''},
        formData:{
        "city":'',
        "state_id":'',
        "willing_to_work_locally": "Y",
     //   "willing_to_work_within": 0,
        "willing_to_work_remotely": "N",
        "willing_to_work_full_time": "N",
        "willing_to_work_part_time": "N",
        "willing_to_work_location_id": [],
        "desired_job_type": [
          {
           "employment_type_id": "599e8a5a59bbb543d7a539de",
           "min_amount": 50000,
           "max_amount": 200000,
           "selected" : 'N'
          },
          {
           "employment_type_id": "599e8a6459bbb543d7a539df",
           "min_amount": 0,
           "max_amount": 2000,
           "selected" : 'N'
          }
      ]
        },

      completeStatus : '',
      userImage : '',
      editProfile : false,
      profileComplete : false
       }

       this.getState = this.getState.bind(this);
  }

  goBack(){
    browserHistory.push('/attorney-profile-headline');
  }
  getState() {

    const that = this;
    let list = [];
    ApiCall('get','/getState',{},'', function(err, response){
      if(err){
        console.log("error : ",err)
      }else{
        if(response.data.Code == 200 && response.data.Status == true){
           //that.setState({state_list : response.data.Data});

          let data = response.data.Data;
            for(var key in response.data.Data){

                list.push({value:data[key]._id,label:data[key].name});
              }
             that.setState({options:list})


        }else {
          console.log(response.data.Message);

        }
      }
    })
  }


  componentDidMount() {
   this.setState({seekeractive : 'tab-btn-blue'});
   this.setState({posteractive : 'tab-btn-white'});
    var pmdSliderValueInput = document.getElementById('pmd-slider-value-input');
    this.refs.willing_to_work_locally.checked = true;
    this.getState();var formVal;
    var thisObj = this;
    var valueInput = document.getElementById('value-input');


      //  var formVal = thisObj.state.formData;
     //   var formErr = this.state.formErrors;
        $('.work-within .pmd-checkbox > input[type=checkbox]').change(function(){
          formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
            $('.location-slider-wrapper').removeClass("slider-disabled");
              formVal.willing_to_work_locally = 'Y';
              formVal.willing_to_work_location_id = [cookieManager.getCookie('stateId')];
          }
          else {
            $('.location-slider-wrapper').addClass("slider-disabled");
             formVal.willing_to_work_locally = 'N';
             formVal.willing_to_work_location_id = [];
          }

          thisObj.setState({formData : formVal},function(){
          //  console.log( thisObj.state.formData.willing_to_work_location_id);
            thisObj.logChange();
          });
      //    thisObj.setState({formErrors : formErr})
        });

        $('.work-permanent .pmd-checkbox > input[type=checkbox]').change(function(){
          formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
            $('.permanent-slidder-wrapper').removeClass("slider-disabled");
        //    thisObj.setState({parmanent : 'Y'});
          }
          else {
            $('.permanent-slidder-wrapper').addClass("slider-disabled");
       //     thisObj.setState({parmanent : 'N'});
          }
        });

        $('.work-contract .pmd-checkbox > input[type=checkbox]').change(function(){
           formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
            $('.contract-slidder-wrapper').removeClass("slider-disabled");
        //    thisObj.setState({contract : 'Y'});

          }
          else {
            $('.contract-slidder-wrapper').addClass("slider-disabled");
          //  thisObj.setState({work_contract : 'N'});
          }
        });
        $('.work-part-time .pmd-checkbox > input[type=checkbox]').change(function(){
           formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
        //    formData.willing_to_work_part_time = 'Y';
          }
          else {
        //    formData.willing_to_work_part_time = 'N';
          }
        });
        $('.work-full-time .pmd-checkbox > input[type=checkbox]').change(function(){
           formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
       //     formData.willing_to_work_full_time = 'Y';
          }
          else {
          // formData.willing_to_work_full_time = 'N';
          }
        });
        $('.work-remotely .pmd-checkbox > input[type=checkbox]').change(function(){
          formVal = thisObj.state.formData;
          if($(this).is(":checked")) {
         //   formData.willing_to_work_remotely = 'Y';
          }
          else {
         //  formData.willing_to_work_remotely = 'N';
          }


        });


    let that = this;

    ApiCall('get','/getUserProfile/job_seeker_info/job_posters_info',{},Util.getToken() , function(err, response){
      if(err){
        console.log("error : ",err)
      }else{
        console.log(response);
          let formData =  Object.assign({},that.state.formData);
          if(response.data.Code == 200 && response.data.Status == true){
            var userData = Util.getUserData();
            if(userData){
              userData.userImage = response.data.Data.job_seeker_info.network.photo;
              that.setState({userImage : (userData.userImage && (response.data.s3BucketUrl + userData.userImage))});
              cookieManager.setCookie('userData', JSON.stringify(userData));
            }

            if(response.data.Data.job_seeker_info.is_profile_completed == 'Y'){
              that.setState({editProfile : true, profileComplete : true});
            }else{
              that.setState({editProfile : false , profileComplete : false});
            }
            let data = response.data.Data.job_seeker_info.job_profile;
            formData.city = data.city;
            formData.state_id = data.state_id;
            that.state.state_name = data.state_name;
            formData.willing_to_work_location_id = data.willing_to_work_location_id;
            cookieManager.setCookie('stateId', data.willing_to_work_location_id);
           // that.setState({stateId:data.willing_to_work_location_id});
              formData.willing_to_work_locally = data.willing_to_work_locally;
            if(data.willing_to_work_locally == 'Y'){
              that.refs.willing_to_work_locally.checked = true;
              // $('.location-slider-wrapper').removeClass("slider-disabled");
            //  pmdSliderValueInput.noUiSlider.set(data.willing_to_work_within);
            }else{
              that.refs.willing_to_work_locally.checked = false;
            }
            if(data.willing_to_work_part_time == 'Y'){
              that.refs.willing_to_work_part_time.checked = true;
              formData.willing_to_work_part_time = data.willing_to_work_part_time;
            }
            if(data.willing_to_work_remotely == 'Y'){
              that.refs.willing_to_work_remotely.checked = true;
              formData.willing_to_work_remotely = data.willing_to_work_remotely;

            }
            if(data.willing_to_work_full_time == 'Y'){
              that.refs.willing_to_work_full_time.checked = true;
              formData.willing_to_work_full_time = data.willing_to_work_full_time;
            }
            if(data.desired_job_type.length > 0){
              if(data.desired_job_type[0].selected == 'Y'){
                 formData.desired_job_type[0].selected = 'Y';
                 that.setState({work_permanent: 'Y'});
                 that.multiPermanentRange(data['desired_job_type'][0]['min_amount'],data['desired_job_type'][0]['max_amount'])
                 that.refs.work_permanent.checked = true;
                 $('.permanent-slidder-wrapper').removeClass("slider-disabled");
              }
              else{
               that.multiPermanentRange(data['desired_job_type'][0]['min_amount'],data['desired_job_type'][0]['max_amount'])

              }
              if(data.desired_job_type[1].selected == 'Y'){
                formData.desired_job_type[1].selected = 'Y';
                that.setState({work_contract: 'Y'});
                that.multiContractRange(data['desired_job_type'][1]['min_amount'],data['desired_job_type'][1]['max_amount']);
                that.refs.work_contract.checked = true;
                $('.contract-slidder-wrapper').removeClass("slider-disabled");

              }
              else{
                that.multiContractRange(data['desired_job_type'][1]['min_amount'],data['desired_job_type'][1]['max_amount'])

              }

               //document.getElementById('value-input').value = data['willing_to_work_within'] ? data['willing_to_work_within']+ ' Miles' : '200 Miles';
               document.getElementById('permanent-value-min').innerHTML = "$"+data['desired_job_type'][0]['min_amount'];
               document.getElementById('permanent-value-max').innerHTML = "$"+data['desired_job_type'][0]['max_amount'];
               formData['desired_job_type'][0]['min_amount'] = data['desired_job_type'][0]['min_amount'];
               formData['desired_job_type'][0]['max_amount'] = data['desired_job_type'][0]['max_amount'];
                document.getElementById('contract-value-min').innerHTML = "$"+data['desired_job_type'][1]['min_amount'];
                document.getElementById('contract-value-max').innerHTML = "$"+data['desired_job_type'][1]['max_amount'];
                formData['desired_job_type'][1]['min_amount'] = data['desired_job_type'][1]['min_amount'];
                formData['desired_job_type'][1]['max_amount'] = data['desired_job_type'][1]['max_amount'];
            }
            else{
              that.multiPermanentRange(50000,200000);
              that.multiContractRange(0,2000);

            }



            that.setState({formData});

           // let formData = this.state.formData;
            //formData = Object.assign(formData, response.data.Data)
            that.setState({completeStatus : response.data.Data.job_seeker_info.last_visited_page});
            console.log(formData)
        }else{
          console.log(err);
        }
      }
    })

  }
  multiPermanentRange(val1,val2){
    // pmd slider with multiple handler values

     if(!val1){
      val1 = 50000;
     }
     if(!val2){
      val2 = 200000;
     }
     var pmdSliderValueRange = document.getElementById('pmd-slider-permanent-rate');

     noUiSlider.create(pmdSliderValueRange, {
       start: [ val1, val2 ], // Handle start position
       connect: true, // Display a colored bar between the handles
       tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
       format: wNumb({
         decimals: 0,
         thousand: ',',
         prefix: '$',
         postfix: '',
       }),
       range: { // Slider can select '0' to '100'
         'min': 50000,
         'max': 200000
       },
       step: 1000
     });

     var valueMaxPermanent = document.getElementById('permanent-value-max'),
       valueMinPermanent = document.getElementById('permanent-value-min');

     // When the slider value changes, update the input and span
     pmdSliderValueRange.noUiSlider.on('update', function( values, handle ) {
       if ( handle ) {
         valueMaxPermanent.innerHTML = values[handle];

       } else {
         valueMinPermanent.innerHTML = values[handle];
       }
     });
     ///////////////////////

  }

  multiContractRange(val1,val2){

   if(!val1){
    val1 = 0;
   }
   if(!val2){
    val2 = (val2 == 0) ? 0 : 2000;
   }
   // pmd slider with multiple handler values
   var pmdSliderValueRange = document.getElementById('pmd-slider-contract-rate');

   noUiSlider.create(pmdSliderValueRange, {
     start: [ val1,val2 ], // Handle start position
     connect: true, // Display a colored bar between the handles
     tooltips: [ wNumb({ decimals: 0 }), wNumb({ decimals: 0 }) ],
     format: wNumb({
       decimals: 0,
       thousand: ',',
       prefix: '$',
       postfix: '',
     }),
     range: { // Slider can select '0' to '100'
       'min': 0,
       'max': 2000
     },
     step:10

   });

   var valueMaxContract = document.getElementById('contract-value-max'),
     valueMinContract = document.getElementById('contract-value-min');

   // When the slider value changes, update the input and span
   pmdSliderValueRange.noUiSlider.on('update', function( values, handle ) {
     if ( handle ) {
       valueMaxContract.innerHTML = values[handle];
     } else {
       valueMinContract.innerHTML = values[handle];
     }
   });
  }

  handleInput(e){

    const target = e.target;
    const name = target.name;
    let formD = Object.assign({}, this.state.formData);

    if(name == "willing_to_work_locally" || name == "willing_to_work_remotely" || name == "willing_to_work_full_time" || name == "willing_to_work_part_time"){
         if(target.value == 'N'){
          formD[e.target.name] = 'Y';
         }
         else{
          formD[e.target.name] = 'N';
         }
     this.setState({formD});
    }
    else if(name == "work_permanent" || name == "work_contract"){
      if(target.value == 'N'){
       this.setState({[e.target.name]:'Y'});
           if(name == 'work_contract'){
             formD['desired_job_type'][1]['min_amount'] = 0;
             formD['desired_job_type'][1]['max_amount'] = 2000;
             formD['desired_job_type'][1]['selected'] = 'N';
           }
           else if(name == "work_permanent"){
            formD['desired_job_type'][0]['min_amount'] = 50000;
            formD['desired_job_type'][0]['max_amount'] = 200000;
            formD['desired_job_type'][0]['selected'] = 'N';

           }
      }
      else{
       this.setState({[e.target.name]:'N'});
           if(name == 'work-contract'){
            formD['desired_job_type'][0]['min_amount'] = (document.getElementById('permanent-value-min').innerHTML).replace("$","");
            formD['desired_job_type'][0]['max_amount'] = (document.getElementById('permanent-value-max').innerHTML).replace("$","");
            formD['desired_job_type'][1]['selected'] = 'Y';
           }
           else if(name == 'work_permanent'){
            formD['desired_job_type'][1]['min_amount'] = (document.getElementById('permanent-value-min').innerHTML).replace("$","");
            formD['desired_job_type'][1]['max_amount'] = (document.getElementById('permanent-value-max').innerHTML).replace("$","");
            formD['desired_job_type'][1]['selected'] = 'Y';
           }
      }
    }
   this.setState({formData : formD});
  }

  handleProceed(e){
   // window.scrollTo(0,0);
    let obj = { 'job_seeker_info' : {
      'job_profile' : {}
    }}
    let callFrom = e.target.name;
    let formData = Object.assign({},this.state.formData);
   // formData['willing_to_work_within'] = (document.getElementById('value-input').value).replace("Miles","");
    if(this.state.work_permanent == 'Y'){
      formData['desired_job_type'][0]['min_amount'] = (document.getElementById('permanent-value-min').innerHTML).replace("$","");
      formData['desired_job_type'][0]['max_amount'] = (document.getElementById('permanent-value-max').innerHTML).replace("$","");
      formData['desired_job_type'][0]['min_amount'] = formData['desired_job_type'][0]['min_amount'].replace(/,/g, "");
      formData['desired_job_type'][0]['max_amount'] = formData['desired_job_type'][0]['max_amount'].replace(/,/g, "");

      formData['desired_job_type'][0]['employment_type_id'] = '599e8a5a59bbb543d7a539de';
      formData['desired_job_type'][0]['selected'] = 'Y';

    }
    else{
      formData['desired_job_type'][0]['min_amount'] = 50000;
      formData['desired_job_type'][0]['max_amount'] = 200000;

      formData['desired_job_type'][0]['employment_type_id'] = '599e8a5a59bbb543d7a539de';
      formData['desired_job_type'][0]['selected'] = 'N';
    }
    if(this.state.work_contract == 'Y'){

        formData['desired_job_type'][1]['min_amount'] = (document.getElementById('contract-value-min').innerHTML).replace("$","");
        formData['desired_job_type'][1]['max_amount'] = (document.getElementById('contract-value-max').innerHTML).replace("$","");
        formData['desired_job_type'][1]['min_amount'] = formData['desired_job_type'][1]['min_amount'].replace(/,/g, "");
        formData['desired_job_type'][1]['max_amount'] = formData['desired_job_type'][1]['max_amount'].replace(/,/g, "");
        formData['desired_job_type'][1]['employment_type_id'] = '599e8a6459bbb543d7a539df';
        formData['desired_job_type'][1]['selected'] = 'Y';
    }
    else{
      formData['desired_job_type'][1]['min_amount'] = 0;
      formData['desired_job_type'][1]['max_amount'] = 2000;
      formData['desired_job_type'][1]['employment_type_id'] = '599e8a6459bbb543d7a539df';
      formData['desired_job_type'][1]['selected'] = 'N';
    }

    let _this = this;
    obj.job_seeker_info.job_profile = formData;
    this.setState({formData},function(){
      _this.setState({loaded:false},function(){
      if(!_this.state.formErrors.willing_to_work_location_id){
        ApiCall('post','/userJobProfile',obj,Util.getToken(), function(err, response){
          Util.showHideFlashMsg();
          if(err){
            _this.setState({resSuccess : false, resError: true, message : err});
            _this.setState({loaded:true});
          }else{
            console.log(response);
            if(response.data.Code == 200 && response.data.Status == true){

              console.log(response);
              _this.setState({submitted:true});
              if(callFrom == "save")
              {
                 _this.setState({resSuccess : true, resError: false, message : CONST.SUCCESS_UPDATE_PROFILE});
                // Util.refreshPage();
              }else{
                Util.changeUrl('/attorney-profile-get-started');
              }
              // _this.setState({resSuccess : true, resError: false, message : response.data.Message});

              //thi s.setState({formData});
            }else{
              _this.setState({resSuccess : false, resError: true, message : CONST.OOPS_ERROR});
              window.scrollTo(0,0);
            }
            _this.setState({loaded:true});
          }
          //
        })
      }
  _this.setState({loaded:true});
    })
    })

  }

 logChange(val){
  console.log("in")
   let list = [];
   if(val){
    for(var key in val){
      list.push(val[key].value);
    }
   }
   var fieldValidationErrors = Object.assign({},this.state.formErrors);
   var formData = Object.assign({},this.state.formData);
   formData.willing_to_work_location_id = list;
      if(formData.willing_to_work_location_id.length <=0 && this.refs.willing_to_work_locally.checked){
          fieldValidationErrors.willing_to_work_location_id = CONST.ENTER_LOCATION;
        }
    else if(formData.willing_to_work_location_id.length <=0 && !this.refs.willing_to_work_locally.checked){
       fieldValidationErrors.willing_to_work_location_id = '';
    }
    else{
          fieldValidationErrors.willing_to_work_location_id = '';
          this.refs.willing_to_work_locally.checked = true;
          formData.willing_to_work_locally = 'Y';
        }
  this.setState({formErrors:fieldValidationErrors});
  this.setState({formData},function(){

   });
 }

  render(){
    return (
      <div>
        <Commonheader userImage={this.state.userImage} />
        <div className="pro-basic-info job-profile content-wrapper container">

        <TopContent thisObj={this} active={this.state.seekeractive} inactive={this.state.posteractive} submitted={this.state.submitted}  showP = {Util.showpop} headTitle="Job Type" content="Finally, please provide details regarding the type of opportunities you are interested in exploring on Legably."/>

        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={this.goBack.bind(this)}></span> Job Type<span className={this.state.completeStatus >= 4 ? 'next' : 'next disabled-element'} onClick={()=>Util.changeUrl('/attorney-profile-get-started')}></span> </div>

        <ProfileBullet currentProfilePage="4" completeStatus={this.state.completeStatus} profileComplete={this.state.profileComplete} />

        <div className="job-form form">

          <div className={ this.state.message ?'addMessage job-card card':'job-card card'}>

            <h4>Job Type</h4>

            <h5>Location</h5>
            <div className="work-within checkbox pmd-default-theme row">
              <label className="pmd-checkbox col-sm-3 pt-5">
                <input ref="willing_to_work_locally" value={this.state.formData.willing_to_work_locally} name="willing_to_work_locally" onChange={this.handleInput.bind(this)} type="checkbox" /><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Willing to work in</span>
              </label>

            {/*<span ref="slider" className="location-slider-wrapper slider-disabled">

                <div id="pmd-slider-value-input" className="pmd-range-slider noUi-target noUi-ltr noUi-horizontal noUi-connect" min="1" max="500">

                </div>

                <div className="form-group pmd-textfield pmd-textfield-floating-label-completed">
                  <input type="text" className="form-control" id="value-input" readOnly="readonly" />
                </div>
              </span>*/}
             <div className="select-parent col-sm-6">
              <Select
                        multi
                        onBlurResetsInput = {true}
                        autosize = {false}
                        onNewOptionClick={(value)=>this.logChange(value)}
                        onChange={(value)=>this.logChange(value,'skill_used_id')}
                        options={this.state.options}
                        placeholder="States"
                        value={this.state.formData.willing_to_work_location_id}

              />
              </div>
            <span className="col-sm-3 pt-5 clr">{this.state.formErrors.willing_to_work_location_id !== '' ? this.state.formErrors.willing_to_work_location_id : ''}</span>


            </div>


            <div className="work-remotely checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input ref="willing_to_work_remotely" type="checkbox" value={this.state.formData.willing_to_work_remotely} name="willing_to_work_remotely" onChange={this.handleInput.bind(this)}/><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Willing to work Remotely</span>
              </label>
            </div>

            <h5>Desired hours</h5>
            <div className="work-part-time checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input ref="willing_to_work_part_time" type="checkbox" value={this.state.formData.willing_to_work_part_time} name ="willing_to_work_part_time" onChange={this.handleInput.bind(this)}/><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Willing to work part-time</span>
              </label>
            </div>

            <div className="work-full-time checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input  ref="willing_to_work_full_time" type="checkbox" value={this.state.formData.willing_to_work_full_time} name="willing_to_work_full_time" onChange={this.handleInput.bind(this)}/><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Willing to work full-time</span>
              </label>
            </div>

            <h5>Desired job type and compensation</h5>
            <div className="work-permanent checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input  ref="work_permanent" name="work_permanent" type="checkbox" value={this.state.work_permanent}  onChange={this.handleInput.bind(this)}/><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Permanent (Salaried)</span>
              </label>

              <span className="permanent-slidder-wrapper slider-disabled">

                <span className="range-value">
                    <span id="permanent-value-min"></span>
                </span>

                <span id="pmd-slider-permanent-rate" className="pmd-range-slider noUi-target noUi-ltr noUi-horizontal noUi-background">

                </span>

                <span className="range-value text-right ">
                    <span id="permanent-value-max"></span>
                </span>
              </span>
            </div>

            <div className="work-contract checkbox pmd-default-theme">
              <label className="pmd-checkbox">
                <input ref="work_contract" name="work_contract" type="checkbox" value={this.state.work_contract} onChange={this.handleInput.bind(this)} /><span className="pmd-checkbox-label">&nbsp;</span>
                <span>Contract (Hourly Rate)</span>
              </label>

              <span className="contract-slidder-wrapper slider-disabled">

                <span className="range-value">
                    <span id="contract-value-min"></span>
                </span>

                <span id="pmd-slider-contract-rate" className="pmd-range-slider noUi-target noUi-ltr noUi-horizontal noUi-background"></span>

                <span className="range-value text-right ">
                    <span id="contract-value-max"></span>
                </span>
              </span>
            </div>

          </div>

          <div className="nxt-prev-btns">
            <button type="button" onClick={this.goBack.bind(this)} className="previouse-btn btn pull-left"> Previous </button>
            <div className={this.state.editProfile == true ? "d-block" : "d-none"}>
                <button type="button" name="save&Next" className="nxt-btn btn-blue btn pull-right" onClick={this.handleProceed.bind(this)}> Save & Next </button >
                <button type="button" name="save" className="nxt-btn btn-blue btn pull-right mr-1p" onClick={this.handleProceed.bind(this)}> Save </button >
                <button type="button" className="nxt-btn btn-white btn pull-right mr-1p" onClick={()=>Util.refreshPage()}> Cancel </button>
              </div>
              <button type="submit" name="save&Next" onClick={this.handleProceed.bind(this)} className={this.state.editProfile == true ? "d-none nxt-btn btn pull-right" : "d-block nxt-btn btn-blue btn pull-right"}> Next </button >
            <span className="clear-fix"></span>
          </div>
        </div>

      </div>
     {this.state.showPopup ?
             <Popup
               url={'/attorney-profile-job-type'}
               content={CONST.POPUP_MSG} obj={this}
             />
             : null
           }

      <Commonfooter />
      <div className={this.state.loaded ? 'fade-layer d-none' : 'fade-layer'}>
       <div className="loader"></div>
      </div>
      {this.state.resSuccess == true ? (<div className="alert alert-success fixed-alert"> {this.state.message}</div>) : ''}
      {this.state.resError == true ? (<div className="alert alert-danger fixed-alert">{this.state.message}</div>): ''}
      </div>
    );
  }
}

export default JobProfile;
