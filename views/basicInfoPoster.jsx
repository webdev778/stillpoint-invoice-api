import React from 'react';
import { Link,browserHistory} from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import EducationCard from './educationCard.jsx';
import Baradmissioncard from './baradmissionCard.jsx';
import {ApiCall} from '../server/config/util.js';
import ProfileBulletPoster from './profileBulletsPoster.jsx';
import MaskedInput from './maskPhoneCompo.jsx';
import Select from 'react-select';
import topContent from './topContent.jsx';
import Util from '../common/Util.js';
import CONST from '../common/Const.js';
import TopContent from './topContent.jsx';
import Popup from './popup.jsx';
import WebService from '../common/WebService.js';
import cookieManager from '../common/cookieManager';

export default class BasicInfoPoster extends React.Component {
  constructor(props) {
          super(props);
          this.state = {         
          seekeractive : 'tab-btn-white',
          posteractive : 'tab-btn-blue',
          options : [],
          showPopup : false,
          formObj:{ 'job_posters_info':{'basic_profile':{'basic_info': {}}}},
          formErrors: {first_name:'',last_name:'',street_address:'', city: '', state_id: '', zipcode: '', phone_number:'',website_url:''},
          formVal:{first_name:'',last_name:'',street_address:'', city: '', state_id: '', zipcode: '', phone_number:'',firm_name : "",title:"",practice_location_id : [],practice_area_id : [],intrested_in_id : [],website_url: ""
      },
      
       completeStatus : '',
       optionsLoc:[],
       statesArr:[],
       formValid:false,
       optionsPrac:[],    
       optionsHire:[],
       basState_coll:[],
       counter:[],
       countArr:[],
       token : '',
       loaded:true,
       editProfile : false,
       resSuccess : false,
       resError : false,
       message : '',
       profileComplete : false,
       firstName : '',
       lastName : ''
      },
          this.handleInfoSubmit = this.handleInfoSubmit.bind(this);
          this.handleUserInput = this.handleUserInput.bind(this);
          this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
          this.fetchPracticeArea = this.fetchPracticeArea.bind(this);
          this.fetchStates = this.fetchStates.bind(this);
          this.fetchInterestedHire = this.fetchInterestedHire.bind(this);
          this.getUserProfile = this.getUserProfile.bind(this);
          this.validateForm = this.validateForm.bind(this);
          this.getMaskedVal = this.getMaskedVal.bind(this);
          this.logChange = this.logChange.bind(this);
          this.changeUrl = this.changeUrl.bind(this);

      }

   fetchStates () {
        var _this = this;
        WebService.fetchStates(function(response) {
            if(!response.status) {
                // handle error
            } else {
              response.Data.forEach((optionsLoc) => {
                  optionsLoc.label = optionsLoc.name;
                  optionsLoc.value = optionsLoc._id;
              });
                _this.setState({statesArr: response.Data || []});
                _this.setState({optionsLoc: response.Data || []})
            }
        });
    }
    fetchPracticeArea () {
        var _this = this;
        WebService.fetchPracticeArea(function(response) {
            if(!response.status) {
                // handle error
            } else {
                response.Data.forEach((optionsPrac) => {
                    optionsPrac.label = optionsPrac.name;
                    optionsPrac.value = optionsPrac._id;
                });
                _this.setState({optionsPrac: response.Data || []});
            }
        });
    }
   /* fetchStates () {
        var _this = this;
        WebService.fetchStates(function(response) {
            if(!response.status) {
                // handle error
            } else {
              response.Data.forEach((optionsLoc) => {
                  optionsLoc.label = optionsLoc.name;
                  optionsLoc.value = optionsLoc._id;
              });
                _this.setState({statesArr: response.Data || []});
            }
        });
    }
    */
    fetchInterestedHire(){
      var _this = this;
      WebService.fetchInterestedHire(function(response) {
          if(!response.status) {
              // handle error
          } else {
            response.Data.forEach((optionsHire) => {
                optionsHire.label = optionsHire.name;
                optionsHire.value = optionsHire._id;
            });
              _this.setState({optionsHire: response.Data || []});
          }
      });
    }

  logChange(val,k) {
         let list = [];
         for(var key in val){
           list.push(val[key].value);
         }
        
         var formVal = Object.assign({},this.state.formVal);
         if(k == 'intrested_in_id'){
          formVal.intrested_in_id = list;
         }
         else if(k == 'practice_area_id'){
           formVal.practice_area_id = list;
         }
         else if(k == 'practice_location_id'){
          formVal.practice_location_id = list;
         }
             
         this.setState({formVal},function(){
            
             
         });
         
  }



  changeUrl(url){
    browserHistory.push(url);
  }

     
  handleUserInput(e){
      
    let formVal = Object.assign({}, this.state.formVal);     
    formVal[e.target.name] = e.target.value;
  
    this.setState({formVal});
  
    if(e.target.name == 'state_id'){
      this.validateField(e.target.name, e.target.value);
    }
    else if(e.target.name == 'phone_number'){
     var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
     e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');

     formVal[e.target.name] = e.target.value;
     this.setState({formVal});
    }
    else if(e.target.name == 'practice_area_id'){
    
    }

  }
   
    componentDidMount() {
          console.log('Component DID MOUNT!')
          this.setState({seekeractive : 'tab-btn-white'});
          this.setState({posteractive : 'tab-btn-blue'});
          this.fetchStates();
          this.fetchPracticeArea();
          this.fetchInterestedHire();
          let thisObj = this;

          this.setState({token:Util.getToken()},function(){
            this.getUserProfile();

          });
      
    }

     getMaskedVal(maskedPhoneNo){
      
       let formVal = Object.assign({}, this.state.formVal);
       formVal.phone_number = maskedPhoneNo;
       this.setState({formVal});
     }   

    handleInfoSubmit(e){
      e.preventDefault();let obj = [];
      let formVal = Object.assign({}, this.state.formVal);  
      // browserHistory.push('/proExperience');
      window.scrollTo(0,0);
      //Utils.isMandatory(this.state.formVal,this.state.formErrors);
      
      let fieldValidationErrors = this.state.formErrors;
      let callFrom = e.target.name;
      switch('street_address') {

          case 'street_address':
            if(!this.state.formVal.street_address){           
              fieldValidationErrors.street_address = CONST.ENTER_STREET_ADD;
            }
            else{
              fieldValidationErrors.street_address = '';
            }
            
            case 'first_name':
              if(this.state.formVal.first_name){                    
                fieldValidationErrors.first_name = '';
                fieldValidationErrors.last_name = this.state.formVal.first_name.match(/^[a-zA-Z \-]+$/) ? '' : CONST.INVALID_FIRSTNAME;
              }
              else{
                fieldValidationErrors.first_name = CONST.ENTER_FIRST_NAME;
              }
            
            case 'last_name':
              if(this.state.formVal.last_name){           
                 fieldValidationErrors.last_name = '';
                 fieldValidationErrors.last_name = this.state.formVal.last_name.match(/^[a-zA-Z \-]+$/) ? '' : CONST.INVALID_LASTNAME;
              }
              else{
                 fieldValidationErrors.last_name = CONST.ENTER_LAST_NAME;
              }
              
            case 'city':
              if(this.state.formVal.city){
                fieldValidationErrors.city = '';
                fieldValidationErrors.city = this.state.formVal.city.match(/^[a-zA-Z ]+$/) ? '' : CONST.INVALID_CITY_NAME;
              
              }else{
                
                fieldValidationErrors.city = CONST.ENTER_CITY; 
              }
              
            case 'state_id':
              
              if(!this.state.formVal.state_id){
                
                fieldValidationErrors.state_id = CONST.ENTER_STATE;
              }else{
                
                fieldValidationErrors.state_id = '';
              }
             
            case 'zipcode':
              if(!this.state.formVal.zipcode){           
                
                fieldValidationErrors.zipcode = CONST.ENTER_ZIPCODE;
              }
              else{
                if(!fieldValidationErrors.zipcode){
                fieldValidationErrors.zipcode = '';
               }
              }
             
            case 'phone_number':
              if(this.state.formVal.phone_number){
                fieldValidationErrors.phone_number = '';
                  
                 
                if((this.state.formVal.phone_number.length <= 11)){   
                /*var x = this.state.formVal.phone_number.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
                this.state.formVal.phone_number = '(' + x[1] + ') ' + x[2] + '-' + x[3];*/   
                   
                formVal.phone_number = this.state.formVal.phone_number;
                this.setState({formVal});                   
                fieldValidationErrors.phone_number = CONST.INVALID_PHONE_NO;       
              }
              else{
                fieldValidationErrors.phone_number ='';       
              }
              }
             else{
                
                fieldValidationErrors.phone_number = CONST.ENTER_PHONE_NO;
              }

              case 'website_url':
                if(this.state.formVal.website_url){           
                 fieldValidationErrors.website_url = formVal.website_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? '' : CONST.INVALID_URL;;
                }
                else{
                  if(fieldValidationErrors.website_url){
                  fieldValidationErrors.website_url = '';
                 }
                }
             break;
          /*   
             
              case 'practice_area_id':
                  
                if(this.state.formVal.practice_area_id.length <=0){              
                   fieldValidationErrors.practice_area_id = CONST.ENTER_PRACTICE_AREA;
                  }
              else{   
                    fieldValidationErrors.practice_area_id = '';
                  }
               
              break;*/
            default:
              break;
          }
         
        var _this = this;     
      //  let formVal = Object.assign({},this.state.formVal);      
        this.setState({formErrors: fieldValidationErrors});
        
        let formObj = this.state.formObj;
        formObj.first_name = formVal.first_name;
        formObj.last_name = formVal.last_name;
        formObj.job_posters_info.basic_profile.basic_info.street_address = formVal.street_address;
        formObj.job_posters_info.basic_profile.basic_info.city = formVal.city;
        formObj.job_posters_info.basic_profile.basic_info.state_id = formVal.state_id;
        formObj.job_posters_info.basic_profile.basic_info.zipcode = formVal.zipcode;
        formObj.job_posters_info.basic_profile.basic_info.phone_number = formVal.phone_number;
      
        formObj.job_posters_info.basic_profile.practice_area_id = formVal.practice_area_id;
        formObj.job_posters_info.basic_profile.firm_name = formVal.firm_name;
        formObj.job_posters_info.basic_profile.title = formVal.title;
        formObj.job_posters_info.basic_profile.practice_location_id = formVal.practice_location_id;
        formObj.job_posters_info.basic_profile.intrested_in_id = formVal.intrested_in_id;
        formObj.job_posters_info.basic_profile.website_url = formVal.website_url;
       
        

        this.setState({formObj:formObj},function(){
          if(this.validateForm()){
          this.setState({loaded:false},function(){
           ApiCall('post','/posterBasicProfile',this.state.formObj,this.state.token, function(err, response){
            Util.showHideFlashMsg();
            if(err){
               console.log("error : ",err)
               _this.setState({loaded:true});
             }else{
               
               if(response.data.Code == 200 && response.data.Status == true){
                  if(callFrom == "save")
                {
                   _this.setState({resSuccess : true, resError: false, message : CONST.SUCCESS_UPDATE_PROFILE});
                   _this.getUserProfile();
                  // Util.refreshPage();
                }else{
                  Util.changeUrl('/post-job-details');
                }
                          
                   }else {
                     _this.setState({resSuccess : false, resError: true, message : response.data.Message});
                     console.log(response.data.Message);
                   }
              _this.setState({loaded:true});
             }
           });
           });
          }
        }); 
      
    }

 
    handleInputOnBlur(e,index){
      let fieldValidationErrors;
     /* if(objName){
        fieldValidationErrors = this.state.formErrors;
      }
      else{
       
      }*/
      fieldValidationErrors = this.state.formErrors;
      this.setState({[e.target.name]: e.target.value});
      this.setState({formErrors: fieldValidationErrors});
      this.validateField(e.target.name, e.target.value,index);
    //  Util.isMandatory(fieldValidationErrors,objName,e.target.name, e.target.value,index,label,type);
      
    }

    limit(len,e){
      let flag = false;
       if (e.target.value.trim().length >= len){
        if(flag){
          if(e.target.value.trim().length == len){
            flag = false;
          }
        }else{
          if(e.ctrlKey && e.keyCode == 65){
            flag = true;
          }
         
          else if(!(e.ctrlKey && e.keyCode ==67) && !(e.ctrlKey && e.keyCode ==88) && !(e.ctrlKey && e.keyCode ==65 )&& e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 46 && e.keyCode !== 9 && e.keyCode !== 17  && (e.keyCode >= 96 || e.keyCode <=105)){
            e.preventDefault();
          }

        }
      }
    }
   

    validateField(fieldName, value,index) {
      let fieldValidationErrors = this.state.formErrors;
     
      switch(fieldName) {
        case 'first_name':
          if(value){ 
            fieldValidationErrors.first_name = '';    
            fieldValidationErrors.first_name = value.match(/^[a-zA-Z \-]+$/) ? '' : CONST.INVALID_FIRSTNAME;             
          }
          else{
           fieldValidationErrors.first_name = CONST.ENTER_FIRST_NAME;
          }
        break;
        case 'last_name':
          if(value){           
            fieldValidationErrors.last_name = '';
            fieldValidationErrors.last_name = value.match(/^[a-zA-Z \-]+$/) ? '' : CONST.INVALID_LASTNAME;
          }
          else{
            fieldValidationErrors.last_name = CONST.ENTER_LAST_NAME;        
          }
        break;
        case 'street_address':
          if(!value){           
            fieldValidationErrors.street_address = CONST.ENTER_STREET_ADD;
          }
          else{
            fieldValidationErrors.street_address = '';
          }
        break;
        case 'city':
          if(value){
            fieldValidationErrors.city = '';
            fieldValidationErrors.city = value.match(/^[a-zA-Z ]+$/) ? '' : CONST.INVALID_CITY_NAME;
          
          }else{
            
            fieldValidationErrors.city = CONST.ENTER_CITY; 
          }
        break;
        case 'state_id':
          
          if(!value){
            
            fieldValidationErrors.state_id = CONST.ENTER_STATE;
          }else{
            
            fieldValidationErrors.state_id = '';
          }
        break;
        case 'zipcode':
          if(!value){           
            
            fieldValidationErrors.zipcode = CONST.ENTER_ZIPCODE;
          }
          else{
             var text = /^[0-9]+$/; 
             if(value.length == 5){
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
           
          }
        break;
        case 'phone_number':
          if(value){
            fieldValidationErrors.phone_number = '';
              
             
            if((value.length <= 11)){   
            /*var x = value.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/);
            value = '(' + x[1] + ') ' + x[2] + '-' + x[3]; */  
            let formVal = Object.assign({}, this.state.formVal);     
            formVal.phone_number = value;
            this.setState({formVal});                   
            fieldValidationErrors.phone_number = CONST.INVALID_PHONE_NO;       
          }
          else{
            fieldValidationErrors.phone_number ='';       
          }
          }
         else{
            
            fieldValidationErrors.phone_number = CONST.ENTER_PHONE_NO;
          }
          break;
          case 'website_url':
             if(this.state.formVal.website_url){           
              fieldValidationErrors.website_url = this.state.formVal.website_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) ? '' : CONST.INVALID_URL;;
             }
             else{
               if(fieldValidationErrors.website_url){
               fieldValidationErrors.website_url = '';
              }
             }
          break;
        default:
        break;
      }
   }
   validateForm() {
    let flag = true;
     for(var key in this.state.formErrors){
      
         
          if(this.state.formErrors[key]){
            flag = false;
            return flag;

          }
         
        
     } 
     return flag;
      //formErrors: {company_name: '',designation: '', start_date: '',end_date: '',employment_type_id:''},
   }

   getUserProfile(){
  
    let that = this;
    ApiCall('get','/getUserProfile/job_posters_info/job_seeker_info',{}, this.state.token, function(err, response){
      if(err){
        console.log("error : ",err)
      }else{
        if(response.data.Code == 200 && response.data.Status == true){
          let formErrors = Object.assign({},that.state.formErrors);
          let formVal = Object.assign({}, that.state.formVal);
          let basicProfile = response.data.Data.job_posters_info.basic_profile;
          let basicInfo = response.data.Data.job_posters_info.basic_profile.basic_info;

          formVal.first_name = response.data.Data.first_name ?  response.data.Data.first_name : '' ;
          formVal.last_name = response.data.Data.last_name ? response.data.Data.last_name : '';

          formVal.street_address = basicInfo.street_address ? basicInfo.street_address : '';
          formVal.city = basicInfo.city ? basicInfo.city : '';
          formVal.state_id = basicInfo.state_id ? basicInfo.state_id : '';
          formVal.zipcode = basicInfo.zipcode ? basicInfo.zipcode : '';
          formVal.phone_number = basicInfo.phone_number ? basicInfo.phone_number : '';
          formVal.firm_name = basicProfile.firm_name ? basicProfile.firm_name : '';
          formVal.title = basicProfile.title ? basicProfile.title : '';
          formVal.practice_location_id = basicProfile.practice_location_id ? basicProfile.practice_location_id : '';
          formVal.practice_area_id = basicProfile.practice_area_id ? basicProfile.practice_area_id : '';
          formVal.intrested_in_id = basicProfile.intrested_in_id ? basicProfile.intrested_in_id : '';
          formVal.website_url = basicProfile.website_url ? basicProfile.website_url : '';
         
          var userData = Util.getUserData();
          if(userData){
            userData.first_name = response.data.Data.first_name;
            userData.last_name = response.data.Data.last_name;
            that.setState({firstName : response.data.Data.first_name, lastName : response.data.Data.last_name});
            cookieManager.setCookie('userData', JSON.stringify(userData));
          }
           if(response.data.Data.job_posters_info.is_profile_completed == 'Y'){
              that.setState({editProfile : true, profileComplete : true});
            }else{
              that.setState({editProfile : false, profileComplete : false});
            }

          that.setState({completeStatus : response.data.Data.job_posters_info.last_visited_page});

        
       
          that.setState({formErrors});
          that.setState({formVal});
              
        }else {
          console.log(response.data.Message);

        }
      }
    })
   }

    handleChange(e){
      this.setState({selectedOrganization:e.target.value});
      Session.set('currentOrganizationId',e.target.value);
    }
 


  render(){

    return (
      <div>
        <Commonheader firstName = {this.state.firstName} lastName = {this.state.lastName}/>
        <div className="pro-basic-info content-wrapper container">
   
         <TopContent active={this.state.seekeractive} inactive={this.state.posteractive} thisObj={this} showP = {Util.showpop} headTitle="Basic Information" content="To get started, please let us know whether you are interested in using Legably to find a job or to post a job by making a selection below.  Then, complete the following form to proceed."/>
          
          <div className="visible-xs mobile-page-heading">Basic Information<span onClick={()=>this.changeUrl("/post-job-details")} className={this.state.completeStatus >= 1 ? 'next' : 'next disabled-element'}></span> </div>
     
          <ProfileBulletPoster currentProfilePage="1" completeStatus={this.state.completeStatus} profileComplete ={this.state.profileComplete}/>
        
          <form onSubmit={this.handleInfoSubmit}>
          <div className="basic-info-form">

            <div className="basic-info-card card">
              <h4>Basic Info</h4>

              <div className="row">
                <div className="col-sm-6">
               
                  <div className={this.state.formErrors.first_name !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="fname" className="control-label">first name*</label>
                    <input onChange={this.handleUserInput} onBlur={this.handleInputOnBlur} type="text" name="first_name" value={this.state.formVal.first_name} id="fname" className="form-control" placeholder="First Name" />
                    <p><span>{this.state.formErrors.first_name !== '' ? this.state.formErrors.first_name : ''}</span></p>
                    
                  </div>
                </div>
                <div className="col-sm-6">
                 
                  <div className={this.state.formErrors.last_name !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="lname" className="control-label">Last Name*</label>
                    <input onChange={this.handleUserInput} name="last_name" onBlur={this.handleInputOnBlur} type="text" value={this.state.formVal.last_name} id="lname" className="form-control" placeholder="Last Name" />
                    <p><span>{this.state.formErrors.last_name !== '' ? this.state.formErrors.last_name : ''}</span></p>
                    
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                 
                  <div className={this.state.formErrors.street_address !== '' ? 'form-group global-error' : 'form-group'}>
                    <label className="control-label">street address*</label>
                    <textarea onBlur={this.handleInputOnBlur} name="street_address" value={this.state.formVal.street_address} onChange={this.handleUserInput} className="form-control" placeholder="Street Address"></textarea>
                    <p><span>{this.state.formErrors.street_address !== '' ? this.state.formErrors.street_address: ''}</span></p>
                    
                  </div>
                </div>
                
              </div>

              <div className="row">
                <div className="col-sm-6">
               
                  <div className={this.state.formErrors.city !== '' ? 'form-group global-error' : 'form-group'}>       
                    <label htmlFor="city" className="control-label">City*</label>
                    <input onBlur={this.handleInputOnBlur} type="text" name="city" value={this.state.formVal.city} id="city" onChange={this.handleUserInput} className="form-control" placeholder="City"/>
                    <p><span>{this.state.formErrors.city !== '' ? this.state.formErrors.city : ''}</span></p>
                    
                  </div>
                </div>
                <div className="col-sm-6">
               
                  <div className={this.state.formErrors.state_id !== '' ? 'form-group global-error' : 'form-group'}>       
                    <label htmlFor="" className="control-label">State*</label>
                    <div className="select-wrapper">  
                      <select onBlur={this.handleInputOnBlur} className="select-simple" name="state_id" value={this.state.formVal.state_id} onChange={this.handleUserInput} className="form-control pmd-select2">
                         <option value="">Select State</option>
                          {this.state.statesArr.map((state) =>
                              <option key={state.name} value={state['_id']}>{state.name}</option>
                          )}
                      </select>
                    </div>
                    <p><span>{this.state.formErrors.state_id !== '' ? this.state.formErrors.state_id : ''}</span></p>
                    
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  
                  <div className={this.state.formErrors.zipcode !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="zipcode" className="control-label">zip Code*</label>
                    <input onBlur={this.handleInputOnBlur} type="text" name="zipcode" value={this.state.formVal.zipcode} id="zipcode" onChange={this.handleUserInput} className="form-control" placeholder="Zip Code"/>
                    <p><span>{this.state.formErrors.zipcode !== '' ? this.state.formErrors.zipcode : ''}</span></p>
                               
                  </div>
                </div>
                <div className="col-sm-6">
                <div className={this.state.formErrors.phone_number !== '' ? 'form-group global-error' : 'form-group'}>

                  <label htmlFor="phone_number" className="control-label">Phone Number*</label>
                
                  <MaskedInput phonevalue={this.state.formVal.phone_number} isReverse={false} mask={"000-000-0000"} onblur={this.handleInputOnBlur} getvalue={this.getMaskedVal}/>
                  <p><span>{this.state.formErrors.phone_number !== '' ? this.state.formErrors.phone_number : ''}</span></p>
                 </div>
                </div>
              </div>

            </div>

            <div className="additional-info-card card">
              <h4>Additional Information</h4>

              <div className="row">
                <div className="col-sm-6">
               
                   <div className="form-group">
                    <label htmlFor="fname" className="control-label">firm name</label>
                    <input onChange={this.handleUserInput} onBlur={this.handleInputOnBlur} type="text" name="firm_name" value={this.state.formVal.firm_name} id="fname" className="form-control" placeholder="Firm Name" />
                   </div>
                  
                </div>
                <div className="col-sm-6">
                   <div className="form-group">
                    <label htmlFor="lname" className="control-label">Title</label>
                    <input onChange={this.handleUserInput} name="title" onBlur={this.handleInputOnBlur} type="text" value={this.state.formVal.title} id="lname" className="form-control" placeholder="Title" />
                    </div>
                 
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                   <div className="form-group">
                    <label className="control-label">Practice Location(s)</label>
                  <Select    
                        multi
                        onBlurResetsInput = {true}
                        autosize = {false}
                       
                        onChange={(value)=>this.logChange(value,'practice_location_id')}
                        options={this.state.optionsLoc}
                        placeholder="Select Practice Location(s)"
                        value={this.state.formVal.practice_location_id}
                      />
                      </div>
                </div>
                <div className="col-sm-6">
                 
                <div className="form-group">
                    <label className="control-label">Practice Area(s)</label>
                    <Select    
                          multi
                          onBlurResetsInput = {true}
                          autosize = {false}
                        
                          onChange={(value)=>this.logChange(value,'practice_area_id')}
                          options={this.state.optionsPrac}
                          placeholder="Select Practice Area(s)"
                          value={this.state.formVal.practice_area_id}
                        />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
               
                <div className="form-group">
                    <label htmlFor="fname" className="control-label">INTERESTED IN HIRING (NOW OR IN THE FUTURE)</label>
                    <Select    
                          multi
                          onBlurResetsInput = {true}
                          autosize = {false}
                        
                          onChange={(value)=>this.logChange(value,'intrested_in_id')}
                          options={this.state.optionsHire}
                          placeholder="Select Interested in Hiring"
                          value={this.state.formVal.intrested_in_id}
                        />
                        </div>
                </div>
                <div className="col-sm-6">
                 
                  <div className={this.state.formErrors.website_url !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="website_url" className="control-label">Website</label>
                    <input onChange={this.handleUserInput} name="website_url" onBlur={this.handleInputOnBlur} type="text" value={this.state.formVal.website_url} className="form-control" placeholder="Website" />
                    <p><span>{this.state.formErrors.website_url !== '' ? this.state.formErrors.website_url : ''}</span></p>
                    
                  </div>
                </div>
              </div>

            </div>
            
            <div className="nxt-prev-btns">
              <div className={this.state.editProfile == true ? "d-block" : "d-none"}>
                <button type="button" name="save&Next" className="nxt-btn btn-blue btn pull-right" onClick={this.handleInfoSubmit}> Save & Next </button >
                <button type="button" name="save" className="nxt-btn btn-blue btn pull-right mr-1p" onClick={this.handleInfoSubmit}> Save </button >
                <button type="button" className="nxt-btn btn-white btn pull-right mr-1p" onClick={()=>Util.refreshPage()}> Cancel </button>
              </div>
              <button type="submit" name="save&Next" className={this.state.editProfile == true ? "d-none nxt-btn btn pull-right" : "d-block nxt-btn btn-blue btn pull-right"} onClick={this.handleInfoSubmit}> Next </button >
            </div>
            </div>
          </form>

        </div>

        {this.state.showPopup ? 
          <Popup
            url={'/post-job-basic-information'}
            content={CONST.POPUP_MSG} obj={this}
          />
          : null
        }

        <Commonfooter/>
        <div className={this.state.loaded ? 'fade-layer d-none' : 'fade-layer'}>
         <div className="loader"></div>
        </div>
        {this.state.resSuccess == true ? (<div className="alert alert-success fixed-alert"> {this.state.message}</div>) : ''}
            {this.state.resError == true ? (<div className="alert alert-danger fixed-alert">{this.state.message}</div>): ''}
        </div>
    );
  }
}

