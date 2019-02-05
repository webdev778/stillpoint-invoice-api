import React from 'react';
import { Link,browserHistory} from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import EducationCard from './educationCard.jsx';
import Baradmissioncard from './baradmissionCard.jsx';
import {ApiCall} from '../server/config/util.js';
import ProfileBullet from './profileBullets.jsx';
import MaskedInput from './maskPhoneCompo.jsx';
import Select from 'react-select';
import topContent from './topContent.jsx';
import Util from '../common/Util.js';
import CONST from '../common/Const.js';
import TopContent from './topContent.jsx';
import Popup from './popup.jsx';
import cookieManager from '../common/cookieManager';
///import ProExperience from '/sign-up-experience.jsx';
export default class ProBasicInfo extends React.Component {
  constructor(props) {
          super(props);
          this.state = {  
          editProfile : false,
          seekeractive : 'tab-btn-blue',
          posteractive : 'tab-btn-white',
          options : [],
          showPopup : false,
          formObj:{ 'job_seeker_info':{'basic_profile':{'basic_info': {}}}},
          showHide : {display: 'inline-block'},
          formErrors: {first_name:'',last_name:'',street_address: '', city: '', state_id: '', zipcode: '', phone_number:'', education: [
         {
         school: "",
         degree_id: '',
         year:'',
         education_additional_information: ''
        }
       ],
       bar_admission: [
        {
         bar_state_id: '',
         bar_registration_number: ''
        }
       ],
       skill_used_id: '',
       practice_area_id:'',
        others:''
      
      },
         formVal:{first_name:'',last_name:'',street_address:'', city: '', state_id: '', zipcode: '', phone_number:'', education: [{
               school: "",
               degree_id: '',
               year:'',
               education_additional_information: ''
              }],
       bar_admission: [{
       bar_state_id: '',
       bar_registration_number: ''
       }
       ],
       practice_area_id:[],
       skill_used_id :[],
       do_you_have_malpractice_insurance:'Y',
       others:'',
       present:'Y',
       showOthers : false
      },
      
       completeStatus : '',
       state_coll:[],
       formValid:false,
       cate_coll:[],
      
       degree_coll:[],
       basState_coll:[],
       educationCard: [],
       barAdmissionCard:[],
       counter:[],
       countArr:[],
       token : '',
       loaded:true,
       resSuccess : false,
       resError : false,
       message : '',
       profileComplete : false,
       firstName : '',
       lastName : ''
      },
          this.handleInfoSubmit = this.handleInfoSubmit.bind(this);
          this.handleUserInput = this.handleUserInput.bind(this);
          this.handleUserEduInput = this.handleUserEduInput.bind(this);
          this.handleUserBarAdInput = this.handleUserBarAdInput.bind(this);
         // this.validateField = this.validateField.bind(this);
          this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
          this.createSelectItems = this.createSelectItems.bind(this);
          this.createCategoryItems = this.createCategoryItems.bind(this);
          this.createDegreeItems = this.createDegreeItems.bind(this);
          this.limit = this.limit.bind(this);
          this.createEducationContainer = this.createEducationContainer.bind(this);
          this.createBarAdmissionContainer = this.createBarAdmissionContainer.bind(this);
          this.getUserProfile = this.getUserProfile.bind(this);
          this.validateForm = this.validateForm.bind(this);
          this.getMaskedVal = this.getMaskedVal.bind(this);
          this.deleteEdu = this.deleteEdu.bind(this);
          this.deleteBar = this.deleteBar.bind(this);
          this.logChange = this.logChange.bind(this);
          this.logChangeSkills = this.logChangeSkills.bind(this);
          this.getskills = this.getskills.bind(this);
          //this.reloadPracArea = this.reloadPracArea.bind(this);
          this.changeUrl = this.changeUrl.bind(this);
         // this.showpop = this.showpop.bind(this);

      }



    getskills(){
        let that = this;
        let list = [];
       // this.setState({loaded:false})

        ApiCall('get','/getSkills',{},'', function(err, response){
          if(err){
            console.log("error : ",err)
          }else{
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
          }
        })

      }

  logChange(val) {
         let list = [];
         for(var key in val){
           list.push(val[key].value);
         }
         var fieldValidationErrors = Object.assign({},this.state.formErrors);
         var formVal = Object.assign({},this.state.formVal);
         formVal.practice_area_id = list;
            if(formVal.practice_area_id.length <=0){              
               fieldValidationErrors.practice_area_id = CONST.ENTER_PRACTICE_AREA;
              }
          else{   
                fieldValidationErrors.practice_area_id = '';
              }
        this.setState({formErrors:fieldValidationErrors});   
        this.setState({formVal},function(){
            
             
         });
         
  }

  logChangeSkills(val,type) {
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
      formVal['showOthers'] = false;
      formVal['others'] = '';
      
    }
    if(flag){
    formVal['showOthers'] = true;  
    }
    else{
      formVal['showOthers'] = false;
      formVal['others'] = '';
    }
    formVal[type] = list;
    this.setState({formVal});
    
  }

  changeUrl(url){
    browserHistory.push(url);
  }

  getMaskedVal(maskedPhoneNo){
   
    let formVal = Object.assign({}, this.state.formVal);
    formVal.phone_number = maskedPhoneNo;
    this.setState({formVal});
  }     
  handleUserInput(e){
      
    console.log(e.target)
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
      /*let obj = this.reloadPracArea();
      let formVal = Object.assign({},this.state.formVal);
      formVal.practice_area_id = obj;          
      this.setState({formErrors: fieldValidationErrors});
      this.setState({formVal:formVal});*/
    }

    // this.setState({[e.target.name]: e.target.value});
  }
    handleUserEduInput(i,e){
      
      let formVal =this.state.formVal;     
      formVal.education[i][e.target.name] = e.target.value;
     
      this.setState({formVal});

       // this.setState({[e.target.name]: e.target.value});
     }
     handleUserBarAdInput(i,e){
    
          
      let formVal = Object.assign({}, this.state.formVal);     
      formVal.bar_admission[i][e.target.name] = e.target.value;
    
      this.setState({formVal});

       // this.setState({[e.target.name]: e.target.value});
     }
  /*  componentWillMount(){
      getUserProfile()
     }*/

  componentWillReceiveProps(){
    console.log("in receive")
  }

    componentDidMount() {
          console.log('Component DID MOUNT!');
          this.setState({seekeractive : 'tab-btn-blue'});
          this.setState({posteractive : 'tab-btn-white'});
          $(".select-simple").select2({
            theme: "bootstrap",
            minimumResultsForSearch: Infinity,
          });
          this.createSelectItems();
          this.createCategoryItems();
          this.createDegreeItems();
          this.getskills();
          let thisObj = this;
          this.setState({token:Util.getToken()},function(){
            this.getUserProfile();

          });

    }

    handleInfoSubmit(e){
      e.preventDefault();let obj = [];
      let callFrom = e.target.name;
      let formVal = Object.assign({}, this.state.formVal);  
      // browserHistory.push('/proExperience');
      window.scrollTo(0,0);
      //Utils.isMandatory(this.state.formVal,this.state.formErrors);
      
      let fieldValidationErrors = this.state.formErrors;

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
             
              case 'school':
           
              for(var i=0;i<(this.state.formVal.education).length;i++){
                if(this.state.formVal.education[i].school){
                  fieldValidationErrors.education[i].school = '';
               //   fieldValidationErrors.education[i].school = this.state.formVal.education[i].school.match(/^[0-9a-zA-Z.]+$/) ? '' : 'Please enter valid school name';
                
                }else{
                  if(!fieldValidationErrors.education[i].school)
                  fieldValidationErrors.education[i].school = CONST.ENTER_SCHOOL; 
                }
              }
               
               case 'degree_id':
               for(var i=0;i<(this.state.formVal.education).length;i++){
                if(!this.state.formVal.education[i].degree_id){
                 fieldValidationErrors.education[i].degree_id = CONST.ENTER_DEGREE;
                }else{
                  
                  fieldValidationErrors.education[i].degree_id = ''; 
                }
              } 
              case 'year':
              for(var i=0;i<(this.state.formVal.education).length;i++){
                if(!this.state.formVal.education[i].year){           
                
                fieldValidationErrors.education[i].year = CONST.ENTER_YEAR;
               }
               else{
                if(!fieldValidationErrors.education[i].year){

                 fieldValidationErrors.education[i].year = '';
                }
              }
              } 
              case 'education_additional_information':
              for(var i=0;i<(this.state.formVal.education).length;i++){
                if(this.state.formVal.education[i].education_additional_information.length > 250){           
                
                fieldValidationErrors.education[i].education_additional_information = CONST.INVALID_ADD_INFO_LENGTH;
               }
               else{
                if(!fieldValidationErrors.education[i].education_additional_information)
                 fieldValidationErrors.education[i].education_additional_information = '';
              }
              }

              case 'bar_state_id':
                for(var i=0;i<(this.state.formVal.bar_admission).length;i++){
                if(!this.state.formVal.bar_admission[i].bar_state_id){           
                
                  fieldValidationErrors.bar_admission[i].bar_state_id = CONST.ENTER_STATE;
               }
               else{
                
                  fieldValidationErrors.bar_admission[i].bar_state_id = '';
              
              }
              }
              case 'bar_registration_number':
              for(var i=0;i<(this.state.formVal.bar_admission).length;i++){
                if(!this.state.formVal.bar_admission[i].bar_registration_number){           
                
                fieldValidationErrors.bar_admission[i].bar_registration_number = CONST.ENTER_BAR_NO;
               }
               else{
                if(!fieldValidationErrors.bar_admission[i].bar_registration_number)
                 fieldValidationErrors.bar_admission[i].bar_registration_number = '';
              }
                } 
             
              case 'practice_area_id':
                  
                if(this.state.formVal.practice_area_id.length <=0){              
                   fieldValidationErrors.practice_area_id = CONST.ENTER_PRACTICE_AREA;
                  }
              else{   
                    fieldValidationErrors.practice_area_id = '';
                  }
               
              break;
            default:
              break;
          }
         
        var _this = this;     
      //  let formVal = Object.assign({},this.state.formVal);      
        this.setState({formErrors: fieldValidationErrors});
        
        let formObj = this.state.formObj;
        formObj.first_name = formVal.first_name;
        formObj.last_name = formVal.last_name;
        formObj.job_seeker_info.basic_profile.basic_info.street_address = formVal.street_address;
        formObj.job_seeker_info.basic_profile.basic_info.city = formVal.city;
        formObj.job_seeker_info.basic_profile.basic_info.state_id = formVal.state_id;
        formObj.job_seeker_info.basic_profile.basic_info.zipcode = formVal.zipcode;
        formObj.job_seeker_info.basic_profile.basic_info.phone_number = formVal.phone_number;
        formObj.job_seeker_info.basic_profile.education = formVal.education;
        formObj.job_seeker_info.basic_profile.bar_admission = formVal.bar_admission;
        formObj.job_seeker_info.basic_profile.practice_area_id = formVal.practice_area_id;
        formObj.job_seeker_info.basic_profile.skill_used_id = formVal.skill_used_id;
        formObj.job_seeker_info.basic_profile.do_you_have_malpractice_insurance = formVal.do_you_have_malpractice_insurance;
        formObj.job_seeker_info.basic_profile.showOthers = formVal.showOthers;
        if(!!formVal.others){
          formObj.job_seeker_info.basic_profile.others = formVal.others;
        }

        this.setState({formObj:formObj},function(){
          if(this.validateForm()){
          this.setState({loaded:false},function(){
           ApiCall('post','/userBasicProfile',this.state.formObj,this.state.token, function(err, response){
             if(err){
               console.log("error : ",err)
               _this.setState({loaded:true});
             }else{
               if(response.data.Code == 200 && response.data.Status == true){
                  Util.showHideFlashMsg();
                if(callFrom == "save")
                {
                  console.log(Util.SUCCESS_UPDATE_PROFILE);
                   _this.setState({resSuccess : true, resError: false, message : CONST.SUCCESS_UPDATE_PROFILE});
                   _this.getUserProfile();
                  // Util.refreshPage();
                }else{
                  _this.changeUrl('/attorney-profile-experience');
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
          case 'school':
           if(value){
             fieldValidationErrors.education[index].school = '';
           
           }else{
             
             fieldValidationErrors.education[index].school = CONST.ENTER_SCHOOL; 
           }
           break;
           case 'degree_id':
            if(!value){
             fieldValidationErrors.education[index].degree_id = CONST.ENTER_DEGREE;
            }else{
              
              fieldValidationErrors.education[index].degree_id = ''; 
            }
          break;
          case 'year':
            if(!value){                    
            fieldValidationErrors.education[index].year = CONST.ENTER_YEAR;
           }
           else{
             fieldValidationErrors.education[index].year = '';
            
                 var text = /^[0-9]+$/;
                
                       if (!text.test(value)) {

                           fieldValidationErrors.education[index].year =CONST.ONLY_NUMERIC_ERROR;
                           return false;
                       }

                       if (value.length < 4) {
                           fieldValidationErrors.education[index].year= CONST.INVALID_YEAR;
                           return false;
                       }
                       var current_year=new Date().getFullYear();
                       if((value < 1920) || (value > current_year))
                           {
                           fieldValidationErrors.education[index].year= CONST.INVALID_YEAR_RANGE;
                           return false;
                           }
                       return true;
                
               
            
          }
           break; 
           case 'education_additional_information':
         
             if(this.state.formVal.education[index].education_additional_information.length > 250){           
             
             fieldValidationErrors.education[index].education_additional_information = CONST.INVALID_ADD_INFO_LENGTH;
            }
            else{
              fieldValidationErrors.education[index].education_additional_information = '';
           }
          break;
          case 'bar_registration_number':
            if(!value){           
            
            fieldValidationErrors.bar_admission[index].bar_registration_number = CONST.ENTER_BAR_NO;
           }
           else{
            var text = /^[0-9]+$/;
            if(value.length <= 15){ 
            if (!text.test(value)) {
                fieldValidationErrors.bar_admission[index].bar_registration_number  = CONST.ONLY_NUMERIC_ERROR;
                 
             }
             else{

                fieldValidationErrors.bar_admission[index].bar_registration_number = '';
             }
           }else{
            fieldValidationErrors.bar_admission[index].bar_registration_number = CONST.INVALID_BAR_LENGTH; 
           }
             
          }
         break; 
           
        case 'bar_state_id':
          if(!this.state.formVal.bar_admission[index].bar_state_id){           
          
            fieldValidationErrors.bar_admission[index].bar_state_id = CONST.ENTER_BAR_SKILL;
         }
         else{
          
            fieldValidationErrors.bar_admission[index].bar_state_id = '';
        
        }
        break; 
        default:
        break;
      }
   }
   validateForm() {
    let flag = true;
     for(var key in this.state.formErrors){
         if(key == 'education'){
           for(var j in this.state.formErrors.education){
            for(var k in this.state.formErrors.education[j]){
              if(this.state.formErrors.education[j][k]){
               flag = false;
               return flag;
              }
            }
             
           }
         }
         else if(key == 'bar_admission'){
          for(var j in this.state.formErrors.bar_admission){
            for(var k in this.state.formErrors.bar_admission[j]){
              if(this.state.formErrors.bar_admission[j][k]){
               flag = false;
               return flag;
              }
            }

           }
         }
         else{
          if(this.state.formErrors[key]){
            flag = false;
            return flag;

          }
         }
        
     } 
     return flag;
      //formErrors: {company_name: '',designation: '', start_date: '',end_date: '',employment_type_id:''},
   }

   getUserProfile(){
  
    let that = this;
    ApiCall('get','/getUserProfile/job_seeker_info/job_posters_info',{}, this.state.token, function(err, response){
      if(err){
        console.log("error : ",err)
      }else{
        if(response.data.Code == 200 && response.data.Status == true){
          let formErrors = Object.assign({},that.state.formErrors);
          let formVal = Object.assign({}, that.state.formVal);
          let basicProfile = response.data.Data.job_seeker_info.basic_profile;
          let basicInfo = response.data.Data.job_seeker_info.basic_profile.basic_info;

          formVal.first_name = response.data.Data.first_name ?  response.data.Data.first_name : '' ;
          formVal.last_name = response.data.Data.last_name ? response.data.Data.last_name : '';

          formVal.street_address = basicInfo.street_address ? basicInfo.street_address : '';
          formVal.city = basicInfo.city ? basicInfo.city : '';
          formVal.state_id = basicInfo.state_id ? basicInfo.state_id : '';
          formVal.zipcode = basicInfo.zipcode ? basicInfo.zipcode : '';
          formVal.phone_number = basicInfo.phone_number ? basicInfo.phone_number : '';

          formVal.practice_area_id = basicProfile.practice_area_id ? basicProfile.practice_area_id : '';
          formVal.skill_used_id = basicProfile.skill_used_id ? basicProfile.skill_used_id : '';
          if(basicProfile.showOthers == "true"){
            formVal.showOthers = basicProfile.showOthers;
            formVal.others = basicProfile.others
          }
          var userData = Util.getUserData();
          if(userData){
            userData.first_name = response.data.Data.first_name;
            userData.last_name = response.data.Data.last_name;
            that.setState({firstName : response.data.Data.first_name, lastName : response.data.Data.last_name});
            cookieManager.setCookie('userData', JSON.stringify(userData));
          }
          if(response.data.Data.job_seeker_info.is_profile_completed == 'Y'){
            that.setState({editProfile : true, profileComplete: true});
          }else{
            that.setState({editProfile : false, profileComplete : false});
          }

          that.setState({completeStatus : response.data.Data.job_seeker_info.last_visited_page});

          if(basicProfile.education.length>0){
            formVal.education = basicProfile.education;
          }
          if(basicProfile.bar_admission.length>0){
            formVal.bar_admission = basicProfile.bar_admission;
          }
          /*if(response.data.Data.practice_area_id)
          formVal.practice_area_id = response.data.Data.practice_area_id ? response.data.Data.practice_area_id;
       */   
           formVal.do_you_have_malpractice_insurance = basicProfile.do_you_have_malpractice_insurance ? basicProfile.do_you_have_malpractice_insurance : 'Y';
           for(var i=0;i<(basicProfile.education.length-1);i++){
            formErrors.education.push({
                     school: "",
                     degree_id: '',
                     year:'',
                     education_additional_information: ''
                    })
           }
           for(var i=0;i<(basicProfile.bar_admission.length-1);i++){
           formErrors.bar_admission.push({            
                            bar_state_id: '',
                            bar_registration_number: ''
                       })
           }
        
          that.setState({formErrors});
          that.setState({formVal});
              
        }else {
          console.log(response.data.Message);

        }
      }
    })


   }

   createEducationContainer(){
      
      var formVal = this.state.formVal;
       var formErrors = this.state.formErrors;
      formVal.education.push({
               school: "",
               degree_id: '',
               year:'',
               education_additional_information: ''
              })
      formErrors.education.push({
               school: "",
               degree_id: '',
               year:'',
               education_additional_information: ''
              })
      this.setState({formVal});
      this.setState({formErrors});
     /* setTimeout(function(){
        $(".select-simple").select2({
          theme: "bootstrap",
          minimumResultsForSearch: Infinity,
        });
      },00)
      */

   }
   createBarAdmissionContainer(){
   
    var formVal = this.state.formVal;
    var formErrors = this.state.formErrors;
    formVal.bar_admission.push({
         
                 bar_state_id: '',
                 bar_registration_number: ''

            })
    formErrors.bar_admission.push({
      bar_state_id: '',
      bar_registration_number: ''
    })
    this.setState({formVal});
    this.setState({formErrors});
   }
   deleteEdu(index){
    var formVal = this.state.formVal;
    var formErrors = this.state.formErrors;
    formVal.education.splice(index,1);
    formErrors.education.splice(index,1);
    this.setState({formVal});
    this.setState({formErrors});
   }
   deleteBar(index){
    var formVal = this.state.formVal;
    var formErrors = this.state.formErrors;
    formVal.bar_admission.splice(index,1);
    formErrors.bar_admission.splice(index,1);
    this.setState({formVal});
    this.setState({formErrors});
   }

    createSelectItems() {
      
      const that = this;
      let list = [];
      ApiCall('get','/getState',{},'', function(err, response){
        if(err){
          console.log("error : ",err)
        }else{
          if(response.data.Code == 200 && response.data.Status == true){
             //that.setState({state_list : response.data.Data});
               
                 response.data.Data.map((stateLs)=>{
                     list.push(<option key={stateLs._id} value ={ stateLs._id }>{stateLs.name}</option>)
                   })
                 that.setState({state_coll:list});
                 that.setState({basState_list:list})  
                
          }else {
            console.log(response.data.Message);

          }
        }
      })
    }
    createDegreeItems() {
      
      const that = this;
      let list = [];

      ApiCall('get','/getDegree',{},'', function(err, response){
        if(err){
          console.log("error : ",err)
        }else{
          
          if(response.data.Code == 200 && response.data.Status == true){
             
                 response.data.Data.map((degreeLs)=>{
                     list.push(<option key={degreeLs._id} value ={ degreeLs._id }>{degreeLs.name}</option>)
                   })
                 that.setState({degree_coll:list});  
                 
          }else {
            console.log(response.data.Message);

          }
        }
      })

    }
 

    createCategoryItems(){
      const that = this;
      let list = [];

      ApiCall('get','/getPracticeArea',{},'', function(err, response){
        if(err){
          console.log("error : ",err)
        }else{
         
          if(response.data.Code == 200 && response.data.Status == true){
             
                 response.data.Data.map((cateLs)=>{
                     list.push({value:cateLs._id,label:cateLs.name})
                   })
                 that.setState({cate_coll:list});  
                 
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
   
         <TopContent active={this.state.seekeractive} inactive={this.state.posteractive} thisObj={this} showP = {Util.showpop} headTitle="Basic Info + Education" content="To get started, please let us know whether you are interested in using Legably to find a job or to post a job by making a selection below.  Then, complete the following form to proceed."/>
          
          <div className="visible-xs mobile-page-heading">Basic Info + Education<span onClick={()=>this.changeUrl("/attorney-profile-experience")} className={this.state.completeStatus >= 1 ? 'next' : 'next disabled-element'}></span> </div>
     
          <ProfileBullet currentProfilePage="1" completeStatus={this.state.completeStatus} profileComplete={this.state.profileComplete}/>
        
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
                        <option value=''>Select state</option>
                        {this.state.state_coll}
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

            <div className="education-card card">
              
                <h4>Education</h4>
                {this.state.formVal.education.map((item,index)=>{
                 
                    return <div key={index}>
                          

                          <div className="row" >
                            <div className="col-sm-6">
                            
                              <div className={this.state.formErrors.education[index].school !== '' ? 'form-group global-error' : 'form-group'}>       
                                <label className="control-label">School*</label>
                                <input type="text" id="school" name="school" onBlur={(e)=>this.handleInputOnBlur(e,index)} key={index} onChange={(e)=>this.handleUserEduInput(index,e)} value={item.school} className="form-control" placeholder="School" />
                                <p><span>{this.state.formErrors.education[index].school !== '' ? this.state.formErrors.education[index].school : ''}</span></p>
                              
                              </div>
                            </div>
                            <div className="col-sm-6">
                    

                              <div className={this.state.formErrors.education[index].degree_id !== '' ? 'form-group global-error' : 'form-group'}>       
                                <label htmlFor="" className="control-label">Degree*</label>
                                <div className="select-wrapper">
                                  <select className="form-control pmd-select2"  onBlur={(e)=>this.handleInputOnBlur(e,index)} onChange={(e)=>this.handleUserEduInput(index,e)}  name="degree_id" value={item.degree_id}>
                                    <option value="">Select Degree</option>
                                     {this.state.degree_coll}
                                  </select> 
                                  
                                </div>
                                <p><span>{this.state.formErrors.education[index].degree_id !== '' ? this.state.formErrors.education[index].degree_id : ''}</span></p>
                                          
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm-6">
                             
                              <div className={this.state.formErrors.education[index].year !== '' ? 'form-group global-error' : 'form-group'}>       
                                <label className="control-label">Year Graduated*</label>
                                <input type="text" id="ygraduated" onBlur={(e)=>this.handleInputOnBlur(e,index)} onChange={(e)=>this.handleUserEduInput(index,e)}  name="year" value={item.year} className="form-control" placeholder="Select Year Graduated" />
                               <p><span>{this.state.formErrors.education[index].year !== '' ? this.state.formErrors.education[index].year : ''}</span></p>
                               
                              </div>
                            </div>
                            <div className="col-sm-6">
                             
                              <div  className={this.state.formErrors.education[index].education_additional_information !== '' ? 'form-group global-error' : 'form-group'} >
                                <label className="control-label">Additional Information</label>
                                <input type="text" onKeyDown={(e)=>this.limit(248,e)} id="add-info" onChange={(e)=>this.handleUserEduInput(index,e)} onBlur={(e)=>this.handleInputOnBlur(e,index)} name="education_additional_information" value={item.education_additional_information} className="form-control" placeholder="Additional Information" />
                                <p><span>{this.state.formErrors.education[index].education_additional_information !== '' ? this.state.formErrors.education[index].education_additional_information : ''}</span></p>
                                
                              </div>
                            </div>
                            
                          </div>
                          <div className="row add-more-wrapper">
                            <a className={index == (this.state.formVal.education.length-1) ? "add-more":"add-more d-none"} onClick={this.createEducationContainer}><img src="/images/add-more-icon.png" alt="add more"/>Add More</a>
                            <a className={index != 0 ? "delete-more" :"d-none delete-more"} onClick={(e)=>this.deleteEdu(index,e)}><img src="/images/delete-more.png" alt="delete more" /> Delete</a>
                            
                          </div>
                          
                           </div>
                 
        
               })}
              

            </div>

            <div className="bar-admission-card card">
                <h4>State Licensure</h4>
                {this.state.formVal.bar_admission.map((item,index)=>{
                 
                    return <div className="row" key={index}>
                        <div className="col-sm-6">
                        
                          <div className="form-group">
                            <label className="control-label">State*</label>
                            <div className={this.state.formErrors.bar_admission[index].bar_state_id !== '' ? 'select-wrapper global-error' : 'select-wrapper'}>
                              <select className="form-control pmd-select2" onBlur={(e)=>this.handleInputOnBlur(e,index)} onChange={(e)=>this.handleUserBarAdInput(index,e)} name="bar_state_id" value={item.bar_state_id}>
                                <option value="">Select State</option>
                                {this.state.basState_list}
                              </select>
                              <p><span>{this.state.formErrors.bar_admission[index].bar_state_id !== '' ? this.state.formErrors.bar_admission[index].bar_state_id : ''}</span></p>
                           
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                        
                          <div className={this.state.formErrors.bar_admission[index].bar_registration_number !== '' ? 'form-group global-error' : 'form-group'} >
                            <label className="control-label">bar registration number*</label>
                            <input type="text" onBlur={(e)=>this.handleInputOnBlur(e,index)} id="bar-reg-num" name="bar_registration_number" onChange={(e)=>this.handleUserBarAdInput(index,e)} className="form-control" placeholder="Bar Registration Number" value={item.bar_registration_number}/>
                           <p><span>{this.state.formErrors.bar_admission[index].bar_registration_number !== '' ? this.state.formErrors.bar_admission[index].bar_registration_number : ''}</span></p>
                           
                          </div>
                        </div>
                        <div className="clear-both"></div>
                      
                      <div className="row add-more-wrapper m-0">
                        <a className={index == (this.state.formVal.bar_admission.length-1) ? "add-more" : "add-more d-none"} onClick={this.createBarAdmissionContainer}><img src="/images/add-more-icon.png" alt="add more"/>Add More</a>
                        <a className={index!== 0 ? "delete-more" : "delete-more d-none"} onClick={(e)=>this.deleteBar(index,e)}><img src="/images/delete-more.png" alt="delete more" /> Delete</a>
                      </div>

                    </div>
 
                      
                     })}
         
            </div>

            <div className="practice-area-card card">

              <h4>Skills</h4>

              <div className="row">
                <div className="col-sm-6">
                  <div className={this.state.formErrors.practice_area_id !== '' ? 'form-group global-error' : 'form-group'} >       
                    <label htmlFor="" className="control-label">Practice Area(s)*</label>
                        <Select    
                              multi
                              onBlurResetsInput = {true}
                              autosize = {false}
                              onNewOptionClick={(value)=>this.logChange(value,index)}
                              onChange={(value)=>this.logChange(value)}
                              options={this.state.cate_coll}
                              placeholder="Select Practice Area(s)"
                              value={this.state.formVal.practice_area_id}
                            />
                    <p><span>{this.state.formErrors.practice_area_id !== '' ? this.state.formErrors.practice_area_id : ''}</span></p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className={this.state.formErrors.skill_used_id !== '' ? 'form-group global-error' : 'form-group'} >       
                    <label htmlFor="" className="control-label">SKILLS</label>                 
                        <Select    
                              multi
                              onBlurResetsInput = {true}
                              autosize = {false}
                              onNewOptionClick={(value)=>this.logChangeSkills(value)}
                              onChange={(value)=>this.logChangeSkills(value,'skill_used_id')}
                              options={this.state.options}
                              placeholder="Select Skill(s)"
                              value={this.state.formVal.skill_used_id}
                            />
                    <p><span>{this.state.formErrors.skill_used_id !== '' ? this.state.formErrors.skill_used_id : ''}</span></p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <div className={(this.state.formVal.showOthers == 'true' || this.state.formVal.showOthers == true) ? 'form-group' : 'form-group d-none'} >
                    <label htmlFor="Others" className="control-label">Others</label>
                    <input value={this.state.formVal.others} onBlur={(e)=>this.handleInputOnBlur(e)} onChange={(e)=>this.handleUserInput(e)} name="others" type="text" id="others" className="form-control" placeholder="Others"/>
                    <p><span>{this.state.formErrors.others !== '' ? this.state.formErrors.others : ''}</span></p>
                  </div>

                </div>
              </div>

            </div>

            <div className="malpractice-insurance-card card">

              <h4>Malpractice Insurance</h4>

              <div className="row">
                <div className="col-sm-6 group-radio">
                  <div className="radio-label pb-10">Do you have malpractice insurance?*</div>
                 
                  <div className="radio-btns" style={this.state.showHide}> 
                  {/*<label className="radio-inline pmd-radio pr-70">
                      <input  type="radio" name="do_you_have_malpractice_insurance" onChange={this.handleUserInput} checked={this.state.formVal.do_you_have_malpractice_insurance === 'Y'}  id="inlineRadio1" value="Y"/>
                      <span htmlFor="inlineRadio1">Yes</span>
                    </label>
                    <label  className="radio-inline pmd-radio">
                        <input  type="radio" name="do_you_have_malpractice_insurance" id="inlineRadio2" onChange={this.handleUserInput} checked={this.state.formVal.do_you_have_malpractice_insurance ==='N'} value="N"/>
                        <span htmlFor="inlineRadio2">No</span>
                    </label>*/}
                    <ul className="list radio-list m-0 p-0">
                          <li className="list__item">
                           <input id='yes' type="radio" className="radio-btn" name="do_you_have_malpractice_insurance" onChange={this.handleUserInput} checked={this.state.formVal.do_you_have_malpractice_insurance === 'Y'} value="Y"/>
                           <label htmlFor='yes' className="label p-0 m-0">Yes</label>
                          </li>
                          <li className="list__item">
                           <input id='no' type="radio" className="radio-btn" name="do_you_have_malpractice_insurance" onChange={this.handleUserInput} checked={this.state.formVal.do_you_have_malpractice_insurance ==='N'} value="N"/>
                           <label htmlFor='no' className="label p-0 m-0">No</label>
                          </li>
                    </ul>
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
            url={'/attorney-profile-basic-info'}
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

