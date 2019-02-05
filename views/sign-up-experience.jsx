import React from 'react';
import { Link ,browserHistory} from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import moment from 'moment';
import axios from 'axios';
/*var assign = require('object-assign');
var PropTypes = require('prop-types');*/
import ProfileBullet from './profileBullets.jsx';
var Multiselect = require('react-widgets').Multiselect;
import Datetime from './react-datetime/DateTime.js';
import Select from 'react-select';
import cookieManager from '../common/cookieManager';
import CONST from '../common/Const.js';
import TopContent from './topContent.jsx';
import Util from '../common/Util.js';
import Popup from './popup.jsx';


export default class ProExperience extends React.Component {
  constructor(props) {
          super(props);
          this.state = {
           seekeractive : 'tab-btn-blue',
           posteractive : 'tab-btn-white',
           showPopup : false,
           formObj: {'job_seeker_info' : {}},
           showHide : {display: 'inline-block'},
             formErrors: {experience: [{company_name: '',designation: '', start_date: '',end_date: '',employment_type_id:'',experience_additional_information: '',others : ''}]},
             formVal: {
              experience: [
              {company_name: "",start_date: '',end_date: '',designation: '',employment_type_id :'',skill_used_id: [],skilled_used_other_text:'',experience_additional_information: "",others:'',present:'Y',showOthers : false}
              ]
            },
             emp_list:[],
             loaded:true,
             options:[],
             token:'',
             completeStatus : '',
             startDate: moment(),
             editProfile : false,
             resSuccess : false,
             resError : false,
             message : '',
             profileComplete : false,
             firstName : '',
             lastName : ''
          };
          this.limit = this.limit.bind(this);
          this.handleUserInput = this.handleUserInput.bind(this);
          this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
          this.createEmpItems = this.createEmpItems.bind(this);
          this.createEducationContainer = this.createEducationContainer.bind(this);
          this.handleStartDateChange = this.handleStartDateChange.bind(this);
          this.handleExpSubmit = this.handleExpSubmit.bind(this);
          this.handleEndDateChange = this.handleEndDateChange.bind(this);
          this.getskills = this.getskills.bind(this);
          this.getUserProfile = this.getUserProfile.bind(this);
          this.validateField = this.validateField.bind(this);
          this.validateForm = this.validateForm.bind(this);
          this.logChange = this.logChange.bind(this);
          this.deleteExp = this.deleteExp.bind(this);
          this.changeUrl = this.changeUrl.bind(this);
          this.openPicker = this.openPicker.bind(this);
          this.checkifAllEmpty = this.checkifAllEmpty.bind(this);
      }

      changeUrl(url){
        browserHistory.push(url);
      }

    deleteExp(index){
     var formVal = this.state.formVal;
     var formErrors = this.state.formErrors;
     formVal.experience.splice(index,1);
     formErrors.experience.splice(index,1);
     this.setState({formVal});
     this.setState({formErrors});
    }

    logChange(val,type,i) {
      console.log(type);
      let list = [];var flag = false;
      var formVal = Object.assign({},this.state.formVal);
      for(var key in val){
            list.push(val[key].value);
            if(type == 'skill_used_id'){
                  if(val[key].label == 'Others'){
                    flag = true;
                  }

            }
      }
      if(!val.length){
        formVal.experience[i]['showOthers'] = false;
        formVal.experience[i]['others'] = '';

      }
      if(flag){
      formVal.experience[i]['showOthers'] = true;
      }
      else{
        formVal.experience[i]['showOthers'] = false;
        formVal.experience[i]['others'] = '';
      }
      formVal.experience[i][type] = list;
      this.setState({formVal});

    }

    componentDidMount() {
          window.scrollTo(0,0);
          this.setState({seekeractive : 'tab-btn-blue'});
          this.setState({posteractive : 'tab-btn-white'});
          console.log('Component DID MOUNT!')
          $(".select-simple").select2({
            theme: "bootstrap",
            minimumResultsForSearch: Infinity,
          });

         // window.testSelAll2 = $('.testSelAll2').SumoSelect({selectAll:true});
          this.createEmpItems();
          this.setState({token:JSON.parse(cookieManager.getCookie('userData')).token},function(){
                     this.getskills();


                   })

    }
    getUserProfile(){
     let that = this;

      axios({
         method: 'get',
         url: 'https://www.legably.com/getUserProfile/job_seeker_info/job_posters_info',
         headers : {
           'token': this.state.token
         }
       }).then(function (response) {

        let formErrors= that.state.formErrors;
        let formVal = Object.assign({}, that.state.formVal);

        if(response.data.Code == 200 && response.data.Status == true){

          let data = response.data.Data.job_seeker_info;
          var userData = Util.getUserData();
          if(userData){
            userData.first_name = response.data.Data.first_name;
            userData.last_name = response.data.Data.last_name;
            that.setState({firstName : response.data.Data.first_name, lastName : response.data.Data.last_name});
            cookieManager.setCookie('userData', JSON.stringify(userData));
          }
          that.setState({completeStatus : data.last_visited_page});
          if(data.is_profile_completed == 'Y'){
                that.setState({editProfile : true, profileComplete : true});
              }else{
                that.setState({editProfile : false, profileComplete : false});
              }
          if(data.experience.length>0){

           formVal.experience = response.data.Data.job_seeker_info.experience;

           for(var i=0;i<(data.experience.length);i++){

              if(data.experience[i].present == 'Y'){
                 formVal.experience[i].present = 'Y';
              }
              formVal.experience[i].start_date = (data.experience[i].start_date) ? moment.parseZone(data.experience[i].start_date).format('MM/DD/YYYY') : '';
              formVal.experience[i].end_date =(data.experience[i].end_date) ? moment.parseZone(data.experience[i].end_date).format('MM/DD/YYYY') : '';

            }

           for(var i=0;i<(data.experience.length-1);i++){

              formVal.experience[i].start_date =(data.experience[i].start_date)? moment.parseZone(data.experience[i].start_date).format('MM/DD/YYYY'):"";
              formVal.experience[i].end_date = (data.experience[i].end_date) ? moment.parseZone(data.experience[i].end_date).format('MM/DD/YYYY'):'';

                   formErrors.experience.push({
                     company_name: "",
                      designation: '',
                      start_date:'',
                      end_date: '',
                      employment_type_id: '',
                      experience_additional_information:''
                     })

           }

           that.setState({formErrors});
           that.setState({formVal});
         }

        }
        else {
          console.log(response.data.Message);

         }
          that.setState({loaded:true});
     })
           .catch(err => {
             console.log(err);

           });
    }
      handleUserInput(e,index){

        let formVal = Object.assign({}, this.state.formVal);
        if((e.target.name).indexOf('Present')>=0){
        e.target.value;
          formVal['experience'][index]['present'] = e.target.value;
          this.setState({formVal});
        }
        else{
          formVal['experience'][index][e.target.name] = e.target.value;
          this.setState({formVal});
        }

        /*if(e.target.name == 'employment_type_id'){
         this.validateField(e.target.name, e.target.value);
       }*/
      }

    handleInputOnBlur(e,index,str){

      if(str == 'startDate'){
        this.validateField('start_date',e,index);
      }
      else if(str == 'endDate'){
        this.validateField('end_date',e,index);
      }
      else{
       this.setState({[e.target.name]: e.target.value});
       this.validateField(e.target.name, e.target.value,index);

      }
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
         case 'company_name':
          /* if(!value){
             fieldValidationErrors.experience[index].company_name = ' Please enter your company name';
           }
           else{*/
             if(value && value.length>100){
              fieldValidationErrors.experience[index].company_name = CONST.INVALID_COMPANY_NAME_LENGTH;
             }
             else{
              fieldValidationErrors.experience[index].company_name = '';
             }

          // }
           break;
         case 'designation':
           /*if(!value){
             fieldValidationErrors.experience[index].designation = ' Please enter your designation';
           }
           else{
             fieldValidationErrors.experience[index].designation = '';
           }*/
           break;
         case 'employment_type_id':

          /* if(!value){

             fieldValidationErrors.experience[index].employment_type_id = 'Please enter your employment type';
           }else{

             fieldValidationErrors.experience[index].employment_type_id = '';
           }*/
           break;
         case 'start_date':
         /*  if(!value){

             fieldValidationErrors.experience[index].start_date = ' Please enter start date';
           }
           else{*/
             fieldValidationErrors.experience[index].start_date = '';
             if(value && moment(value).format('MM/DD/YYYY') != 'Invalid date'){
              var _this = this;

                   if(_this.state.formVal.experience[index].end_date){

                    if(moment(_this.state.formVal.experience[index].end_date).diff(value)<0){

                      fieldValidationErrors.experience[index].start_date = CONST.GREATER_START_DATE_ERROR;
                      this.setState({formErrors: fieldValidationErrors});
                    }
                    else{
                      fieldValidationErrors.experience[index].start_date = '';

                    }
                   }


           }
             else{

            fieldValidationErrors.experience[index].start_date = CONST.INVALID_DATE;

           }
       //  }
           break;

         case 'end_date':
          /* if(!value){

             fieldValidationErrors.experience[index].end_date = ' Please enter end date';
           }
           else{*/
             fieldValidationErrors.experience[index].end_date = '';
             var _this = this;

              if(value && moment(value).diff(_this.state.formVal.experience[index].start_date)<0){
                fieldValidationErrors.experience[index].start_date = CONST.GREATER_START_DATE_ERROR;
                this.setState({formErrors: fieldValidationErrors});
              }
              else{
                fieldValidationErrors.experience[index].start_date = '';

              }


        //   }
           break;
           case 'experience_additional_information':
           if(this.state.formVal.experience[index].experience_additional_information.length > 250){

              fieldValidationErrors.experience[index].experience_additional_information = CONST.INVALID_ADD_INFO_LENGTH;
             }
             else{
               fieldValidationErrors.experience[index].experience_additional_information = '';
            }

            break;
           default:
           break;
       }


         this.setState({formErrors: fieldValidationErrors});

       }

       createEducationContainer(){

          var formVal = this.state.formVal;
          var formErrors = this.state.formErrors;

          formVal.experience.push({
                   company_name: "",
                   designation: '',
                   start_date:'',
                   end_date: '',
                   employment_type_id: '',
                   skill_used_id: [],
                   skilled_used_other_text: '',
                   experience_additional_information: "",
                   others:'',
                   present:'N',
                   showOthers : false
                  })
          formErrors.experience.push({
                  company_name: "",
                   designation: '',
                   start_date:'',
                   end_date: '',
                   employment_type_id: '',
                   experience_additional_information:'',
                   others : ''
                  })
          this.setState({formVal});
          this.setState({formErrors});

       }
    checkifAllEmpty(index){
      if(index != 0){
        let experience =  this.state.formVal.experience;
        if(!experience[index].company_name && !experience[index].experience_additional_information && !(experience[index].employment_type_id.length>0) && !experience[index].designation && !(experience[index].skill_used_id.length>0)){
           this.deleteExp(index);
        }
      }

    }

    handleExpSubmit(e){
           e.preventDefault();
           window.scrollTo(0,0);
           let callFrom = e.target.name;
           let obj = {'job_seeker_info' : {}};

           obj.job_seeker_info = this.state.formVal;


           let fieldValidationErrors = this.state.formErrors;
           for(var i=0;i<(fieldValidationErrors.experience).length;i++){

                      let exp = this.state.formVal.experience;

                        if(!fieldValidationErrors.experience[i].company_name)
                        fieldValidationErrors.experience[i].company_name = '';

                        if(!fieldValidationErrors.experience[i].start_date)
                         fieldValidationErrors.experience[i].start_date = '';

                        if(!fieldValidationErrors.experience[i].end_date || exp[i].end_date== "Invalid date"){
                          fieldValidationErrors.experience[i].end_date = '';
                          //
                        }
                        if(exp[i].end_date== "Invalid date"){
                          exp[i].end_date = '';
                        }

                      if(this.state.formVal.experience[i].experience_additional_information.length > 250){

                         fieldValidationErrors.experience[i].experience_additional_information = CONST.INVALID_ADD_INFO_LENGTH;
                        }
                        else{
                          fieldValidationErrors.experience[i].experience_additional_information = '';
                       }

                       this.checkifAllEmpty(i);


                  }

            this.setState({formErrors: fieldValidationErrors});
            var _this = this;
            //this.setState({formObj: obj},function(){
              if(_this.validateForm()){

               _this.setState({loaded:false},function(){
                axios({
                   method: 'post',
                   url: 'https://www.legably.com/userExperienceProfile',
                   headers : {
                     'token': this.state.token
                   },
                   data:obj
                 }).then(function (response) {
                 Util.showHideFlashMsg();
                 if(response.data.Code == 200 && response.data.Status == true){
                    if(callFrom == "save")
                    {

                      _this.setState({resSuccess : true, resError: false, message : CONST.SUCCESS_UPDATE_PROFILE});

                       //_this.changeUrl('/attorney-profile-experience');
                    }else{
                       Util.changeUrl('/attorney-profile-headline');
                    }
                   }else {
                     console.log(response.data.Message);
                     _this.setState({resSuccess : false, resError: true, message : response.data.Message});
                   }
                   _this.setState({loaded:true});
                 })
               .catch(err => {
                _this.setState({resSuccess : false, resError: true, message : err});
                 console.log(err);
               });
             });
          }
      //  });


        }

    validateForm() {
      let flag = true;
      for(var key in this.state.formErrors){
          if(key == 'experience'){
            for(var j in this.state.formErrors.experience){
              for(var k in this.state.formErrors.experience[j]){
                if(this.state.formErrors.experience[j][k]){
                 flag = false;
                 return flag;
                }
              }

            }
          }
         return flag;
      }
       //formErrors: {company_name: '',designation: '', start_date: '',end_date: '',employment_type_id:''},
    }

    getskills(){
      let that = this;
      let list = [];
            this.setState({loaded:false})
            axios.get('https://www.legably.com/getSkills')
             .then(function (response) {
                if(response.data.Code == 200 && response.data.Status == true){
                  let data = response.data.Data;
                  for(var key in response.data.Data){
                     // list.push({id:data[key]._id,name:data[key].name});
                      list.push({value:data[key]._id,label:data[key].name});
                    }
                  that.setState({options:list})
                }else {
                  console.log(response.data.Message);

                }
                that.getUserProfile();

              })
            .catch(err => {
              console.log(err);
            //  this.getUserProfile();
              this.setState({loaded:true});
            });
    }
    openPicker(){
      this._child.openCalendar();
    }
    createEmpItems() {

      let that = this;
      let list = [];
      axios.get('https://www.legably.com/getEmploymentType')
       .then(function (response) {
          if(response.data.Code == 200 && response.data.Status == true){
             //that.setState({state_list : response.data.Data});

                 response.data.Data.map((empLs)=>{
                     list.push({value:empLs._id,label:empLs.name})
                   })
                 that.setState({emp_list:list});


          }else {
            console.log(response.data.Message);

          }
        })
      .catch(err => {
        console.log(err);

      });

    }
   handleStartDateChange(date,index){
      var startDate
      moment.isMoment(date) ? startDate = date.format("MM/DD/YYYY"): startDate = date;
      let formval = this.state.formVal;
      formval['experience'][index]['start_date'] = startDate;
      this.setState({formval})
    }
    handleEndDateChange(date,index){
      var endDate
      moment.isMoment(date) ? endDate = date.format("MM/DD/YYYY"):endDate = date;
      let formval = this.state.formVal;
      formval['experience'][index]['end_date'] = endDate;
      this.setState({formval});
    }


  render(){
    const validStartDate = (current)=>{

             let currentDate = new Date();
            if(!currentDate)
              return true;
            const yesterday = moment(currentDate);
            return current.isBefore( yesterday );

          };
          const validEndDate = ( current)=>{
                  let currentDate = new Date();
                  if(!currentDate)
                    return true;
                  const yesterday = moment(currentDate);
                  return (current.isBefore( yesterday ));

                };

    return (
      <div>
       <Commonheader firstName = {this.state.firstName} lastName = {this.state.lastName}/>
      <div className="pro-basic-info content-wrapper container">

        <TopContent thisObj={this} active={this.state.seekeractive} inactive={this.state.posteractive}  showP = {Util.showpop} headTitle="Experience" content="Next, please provide us with some basic information regarding your work experience."/>
        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={()=>this.changeUrl("/attorney-profile-basic-info")}></span> Experience <span onClick={()=>this.changeUrl("/attorney-profile-headline")} className={this.state.completeStatus >= 2 ? 'next' : 'next disabled-element'}></span> </div>

        <ProfileBullet currentProfilePage="2" completeStatus={this.state.completeStatus} profileComplete={this.state.profileComplete} />

      <form onSubmit={this.handleExpSubmit}>
        <div className="form experience-form">

          <div className="experience-card card">
            <h4>Experience</h4>

             {this.state.formVal.experience.map((item,index)=>{

              return <div key={index}>
              <div className="row">
              <div className="col-sm-6">

                <div className={this.state.formErrors.experience[index].company_name !== '' ? 'form-group global-error' : 'form-group'}>
                  <label htmlFor="company_name" className="control-label">company name</label>
                  <input tabIndex="1" value={item.company_name} onBlur={(e)=>this.handleInputOnBlur(e,index)} onChange={(e)=>this.handleUserInput(e,index)} name="company_name" onKeyDown={(e)=>this.limit(100,e)} type="text" id="comp-name" className="form-control" placeholder="Company Name"/>
                  <p><span>{this.state.formErrors.experience[index].company_name !== '' ? this.state.formErrors.experience[index].company_name : ''}</span></p>

                </div>
              </div>
              <div className="col-sm-6">

                <div className={this.state.formErrors.experience[index].designation !== '' ? 'form-group global-error' : 'form-group'}>
                  <label className="control-label">Title</label>
                  <input tabIndex="2" value={item.designation}  onBlur={(e)=>this.handleInputOnBlur(e,index)} onChange={(e)=>this.handleUserInput(e,index)} onKeyDown={(e)=>this.limit(100,e)} name="designation" type="text" id="designation" className="form-control" placeholder="Title"/>
                  <p><span>{this.state.formErrors.experience[index].designation !== '' ? this.state.formErrors.experience[index].designation : ''}</span></p>

                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 group-radio">
                <div className="row m-0">
                  <div className="radio-label mb-10">Is This Your Current Employer?</div>

              <ul className="list radio-list m-0">
                    <li className="list__item">
                     <input tabIndex="3" id={'a'+index} type="radio" className="radio-btn" name={"Present"+index} onChange={(e)=>this.handleUserInput(e,index)} checked={item.present === 'Y'} value='Y'/>
                     <label htmlFor={'a'+index} className="label p-0">Yes</label>
                    </li>
                    <li className="list__item m-10">
                     <input tabIndex="4" id={'b'+index} type="radio" className="radio-btn" name={"Present"+index} onChange={(e)=>this.handleUserInput(e,index)} checked={item.present ==='N'} value="N"/>
                     <label htmlFor={'b'+index} className="label p-0">No</label>
                    </li>
                </ul>

                  {/*<div className="radio-btns" style={this.state.showHide}>
                    <label className="radio-inline pmd-radio pr-70">
                      <input  type="radio" name="Present" onChange={(e)=>this.handleUserInput(e,index)} checked={item.present === 'Y'}  id="inlineRadio3" value="Y"/>
                      <span htmlFor="inlineRadio3">Yes</span>
                    </label>
                    <label  className="radio-inline pmd-radio pull-right">
                        <input  type="radio" name="Present" onChange={(e)=>this.handleUserInput(e,index)} checked={item.present ==='N'} value="N"/>
                        <span htmlFor="inlineRadio4">No</span>
                    </label>
                    <div className="clear-fix"></div>
                  </div>*/}
                </div>
              </div>

              <div className="col-sm-6">

                <div className="form-group m-0">
                  <label htmlFor="" className="control-label">duration</label>
                  <div className="row">
                    <div className={this.state.formErrors.experience[index].start_date !== '' ? 'start-date form-group global-error col-xs-12 col-sm-6 m-0' : 'start-date form-group col-xs-12 col-sm-6 m-0'}>
                      <Datetime onChange={(date)=>this.handleStartDateChange(date,index)}
                                value ={item.start_date}
                                input={true}
                                inputProps={{placeholder:'From',name:'searchStartDate',readOnly:true}}
                                name = 'start_date'
                                dateFormat={'MM/DD/YYYY'}
                                timeFormat={false}
                                isValidDate={ validStartDate }
                                onBlur={(date)=>this.handleInputOnBlur(date,index,'startDate')}
                                 />

                      <p><span>{this.state.formErrors.experience[index].start_date !== '' ? this.state.formErrors.experience[index].start_date : ''}</span></p>

                    </div>
                    <div className={item.present == 'Y'? 'd-none' : this.state.formErrors.experience[index].end_date  ? 'end-date form-group global-error  col-xs-12 col-sm-6 m-0' : 'end-date form-group col-xs-12 col-sm-6 m-0'}>

                      <Datetime ref={(dateTimeObj) => { this._child = dateTimeObj; }} onChange={(date)=>this.handleEndDateChange(date,index)}
                                value ={item.end_date}
                                input={true}
                                inputProps={{placeholder:'To',name:'searchStartDate',readOnly:true}}
                                name = 'end_date'
                                dateFormat={'MM/DD/YYYY'}
                                timeFormat={false}
                                isValidDate={ validEndDate }
                                onBlur={(date)=>this.handleInputOnBlur(date,index,'endDate')}

                                />


                      <p><span>{this.state.formErrors.experience[index].end_date !== '' ? this.state.formErrors.experience[index].end_date : ''}</span></p>

                    </div>
                    <span className={item.present == 'Y' ? 'present form-group col-xs-12 col-sm-6':'d-none'}>Present</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">

                <div className={this.state.formErrors.experience[index].employment_type_id !== '' ? 'form-group global-error' : 'form-group'}>

                  <label htmlFor="" className="control-label">Employment type</label>

                  <div className="select-wrapper">
                  {/*<select onBlur={(e)=>this.handleInputOnBlur(e,index)} className="select-simple" name="employment_type_id" value={item.employment_type_id} onChange={(e)=>this.handleUserInput(e,index)} className="form-control pmd-select2">
                      <option value=''>Select Employment type</option>
                      {this.state.emp_list}
                    </select> */}

                    <Select
                              multi
                              onBlurResetsInput = {true}
                              autosize = {false}
                              onNewOptionClick={(value)=>this.logChange(value,index)}
                              onChange={(value)=>this.logChange(value,'employment_type_id',index)}
                              options={this.state.emp_list}
                              placeholder="Employment type"
                              value={item.employment_type_id}

                            />

                  </div>
                 <p><span>{this.state.formErrors.experience[index].employment_type_id !== '' ? this.state.formErrors.experience[index].employment_type_id : ''}</span></p>

                </div>
              </div>
              <div className="col-sm-6">
                    <div className={this.state.formErrors.experience[index].experience_additional_information !== '' ? 'form-group global-error' : 'form-group'} >
                      <label htmlFor="experience_additional_information" className="control-label">additional information</label>
                      <input value={item.experience_additional_information} onBlur={(e)=>this.handleInputOnBlur(e,index)} onChange={(e)=>this.handleUserInput(e,index)} name="experience_additional_information" onKeyDown={(e)=>this.limit(250,e)} type="text" id="additional-info" className="form-control" placeholder="Additional Information"/>
                      <p><span>{this.state.formErrors.experience[index].experience_additional_information !== '' ? this.state.formErrors.experience[index].experience_additional_information : ''}</span></p>
                    </div>

              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                <label htmlFor="skilled_used_other_text" className="control-label">Skills Used</label>
                <Select
                          multi
                          onBlurResetsInput = {true}
                          autosize = {false}
                          onNewOptionClick={(value)=>this.logChange(value,index)}
                          onChange={(value)=>this.logChange(value,'skill_used_id',index)}
                          options={this.state.options}
                          placeholder="Skills Used"
                          value={item.skill_used_id}

                        />
               </div>


              </div>
              <div className="col-sm-6">

                <div className={(item.showOthers == 'true' || item.showOthers == true) ? 'form-group' : 'form-group d-none'} >
                  <label htmlFor="Others" className="control-label">Others</label>
                  <input value={item.others} onBlur={(e)=>this.handleInputOnBlur(e,index)} onChange={(e)=>this.handleUserInput(e,index)} name="others" type="text" id="others" className="form-control" placeholder="Others"/>
                  <p><span>{this.state.formErrors.experience[index].others !== '' ? this.state.formErrors.experience[index].others : ''}</span></p>
                </div>

              </div>
            </div>

            <div className="separator mb-10"></div>


            <div className="row add-more-wrapper">
              <a className={index == (this.state.formVal.experience.length-1) ? "add-more" : "add-more d-none"}  onClick={this.createEducationContainer}><img src="images/add-more-icon.png" alt="add more"/>Add More</a>
              <a className={index!== 0 ? "delete-more" : "delete-more d-none"} onClick={(e)=>this.deleteExp(index,e)}><img src="/images/delete-more.png" alt="delete more" /> Delete</a>
            </div>


            </div>
            })}

          </div>


          <div className="nxt-prev-btns">
            <button type="click" onClick={()=>this.changeUrl("/attorney-profile-basic-info")} className="previouse-btn btn pull-left mb-10">Previous</button >
            <div className={this.state.editProfile == true ? "d-block" : "d-none"}>
                <button type="button" name="save&Next" className="nxt-btn btn-blue btn pull-right" onClick={this.handleExpSubmit}> Save & Next </button >
                <button type="button" name="save" className="nxt-btn btn-blue btn pull-right mr-1p" onClick={this.handleExpSubmit}> Save </button >
                <button type="button" className="nxt-btn btn-white btn pull-right mr-1p" onClick={()=>Util.refreshPage()}> Cancel </button>
              </div>
              <button type="submit" name="save&Next" onClick={this.handleExpSubmit} className={this.state.editProfile == true ? "d-none nxt-btn btn pull-right" : "d-block nxt-btn btn-blue btn pull-right"}> Next </button >
            <span className="clear-fix"></span>
          </div>
        </div>
            </form>
      </div>
           {this.state.showPopup ? <Popup url={'/attorney-profile-experience'} content={CONST.POPUP_MSG} obj={this}/> : null}
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

