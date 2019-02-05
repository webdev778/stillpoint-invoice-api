import React from 'react';
import {ApiCall} from '../server/config/util.js';
import { Link, browserHistory } from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import ProfileBullet from './profileBullets.jsx';
import FileUpload from './FileUpload.jsx';
import Dropzone from 'react-dropzone';
import _ from 'underscore';
import AvatarCropper from  './avatarCropper.jsx';
import Util from '../common/Util.js';
import CONST from '../common/Const.js';
import TopContent from './topContent.jsx';
import Popup from './popup.jsx';
import cookieManager from '../common/cookieManager';

class NetworkProfile extends React.Component {
	constructor (props) {
    super(props);
    this.state = {
      seekeractive : 'tab-btn-blue',
      posteractive : 'tab-btn-white',
    	network:{
    		lawyer_headline : '',
    		about_lawyer : '',
    		linkedin_link : ''
    	},
      formErrors: {lawyer_headline: '',about_lawyer : '',linkedin_link : '', resume : '', photo: '', writing_samples:''},
      lawerHeadlineValid : false,
      aboutLawyerValid : false,
      linkedinValid : false,
      resumeValid : false,
      photoValid : false,
      sampleValid : true,
      userId : '',
      showPopup : false,
      completeStatus : '',
      resumeObj: {},
      cropperOpen: false,
      img: null,
      croppedImg: "/images/upload_image_placeholder.png",
      imgObj : {},
      sampleObj : {},
      accepted: [],
      rejected: [],
      sampleArray : [],
      writing_samples: '',
      maxSize : 3000000,
      multiple : false,
      resumeName : '',
      photoUpdate : false,
      resumeUpdate : false,
      samplesUpdate : false,
      photoLink : '',
      resumeLink : '',
      alreadyAccepted : [],
      deleteDisabled : true,
      loaded:true,
      expand:true,
      editProfile : false,
      userImage : '',
      resSuccess : false,
     resError : false,
     message : '',
     profileComplete : false

  	};
  	this._handleClick = this._handleClick.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
    this.handleRequestHide = this.handleRequestHide.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDropFile = this.onDropFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.deleteResume = this.deleteResume.bind(this);
    this.clearInputValue = this.clearInputValue.bind(this);
    this.expandHide = this.expandHide.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.profileImgError = this.profileImgError.bind(this);

  }
  onDropFile(accepted, rejected,evt){
    console.log("accepted, rejected" , accepted, rejected)
    evt.target.value = null;
   // console.log(accepted, rejected);
    if(accepted.length > 0){
      let error = this.state.formErrors;
      error.resume = "";
      if(accepted[0]){
        let resumeFile = accepted[0];
        let _this = this;
        this.state.resumeObj.name = accepted[0].name;
        this.state.resumeObj.size = accepted[0].size;
        this.state.resumeObj.type = accepted[0].type;
        this.setState({resumeValid : true,formErrors : error, resumeName : accepted[0].name});
        var fileReader = new FileReader();
          fileReader.readAsDataURL(resumeFile);
          fileReader.onload = function(event) {
              _this.state.resumeObj.dataUrl = event.target.result; /*add dataUrl to file properties*/
            _this.setState({
              resumeObj: _this.state.resumeObj, resumeUpdate :true
            });
          }
        }

      // let error = this.state.formErrors;
      // error.resume = CONST.FILE_COUNT_ERROR;
      // this.setState({resumeValid : false,formErrors : error, resumeName : ''});
    }
    else{
      let filetype = rejected[0].type;
      var ext = filetype.substr(filetype.lastIndexOf('/') + 1);
      var validFormats = ['pdf', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'msword'];
      if(validFormats.indexOf(ext) == -1){
        let error = this.state.formErrors;
        error.resume = CONST.INVALID_FILE_FORMAT;
        this.setState({resumeValid : false,formErrors : error, resumeName : rejected[0].name});
      }
      else if(rejected[0].size/1000000 > 3){
        let error = this.state.formErrors;
        error.resume = CONST.RESUME_SIZE_ERROR;
        this.setState({resumeValid : false,formErrors : error, resumeName : rejected[0].name});
      }
    }
  }

  profileImgError(evt){
    // console.log(evt.target);
    this.setState({deleteDisabled: true});
    evt.target.onerror = "";
    evt.target.src = "/images/upload_image_placeholder.png";
    return true;
  }

  clearInputValue(e){
    console.log(e);
    e.target.value = null;
  }

  deleteResume(e){
    let error = this.state.formErrors;
    error.resume = "";
    this.state.resumeObj = {};
    this.setState({resumeValid : true,formErrors : error, resumeName : '', resumeObj : this.state.resumeObj , resumeUpdate : true});
  }


  onDrop(accepted, rejected,evt){
    accepted = this.state.accepted.concat(accepted);
    rejected = this.state.rejected.concat(rejected);
    // console.log(accepted, rejected)
    evt.target.value = null;
    this.setState({rejected : rejected});
    if(rejected.length == 0){
      let error = this.state.formErrors;
      error.writing_samples = "";
      this.setState({sampleValid : true,formErrors : error})
    }else{
      this.setState({sampleValid : false});
      let counter = 0;
      rejected.forEach(file => {
        // console.log("file" ,file)
        var ext = file.type.substr(file.type.lastIndexOf('/') + 1);
        var validFormats = ['pdf', 'vnd.openxmlformats-officedocument.wordprocessingml.document', 'msword'];
        if(validFormats.indexOf(ext) == -1){
          file.error = CONST.INVALID_FILE_FORMAT;
          count++;
        }
        else if(file.size/1000000 > 3){
          file.error = CONST.RESUME_SIZE_ERROR;
          count++;
        }

        if(count == rejected.length){
          this.setState({rejected : rejected,sampleValid : false});
        }

      });

    }

    let count = 0;
    accepted.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        file.filename = file.name;
        file.filesize = file.size;
        file.filetype = file.type;
        file.dataUrl = event.target.result;
        count++;

        if(count == accepted.length){
          this.setState({accepted : accepted , samplesUpdate :true})
        }
      };
    });

  }

componentDidUpdate(){
    if(this.state.cropperOpen){
      const div = document.createElement("div");
      div.className = 'modal-header';
      var elem = document.getElementsByClassName('modal-content')[1];
      elem.insertBefore(div, elem.childNodes[0]);

      var heading = document.createElement('h4');
      heading.className = 'modal-title';
      heading.appendChild(document.createTextNode("Drag to reposition"));

      div.appendChild(heading);
    }

}
  getUserProfile(){
        var _this = this;
    _this.setState({loaded:false},function(){
      ApiCall('get','/getUserProfile/job_seeker_info/job_posters_info',{},Util.getToken(), function(err, response){
        _this.setState({loaded:true});
        if(err){
          // console.log("error : ",err)
          _this.setState({loaded:true});
        }else{

          if(response.data.Code == 200 && response.data.Status == true){

            if(response.data.Data.job_seeker_info.is_profile_completed == 'Y'){
                _this.setState({editProfile : true, profileComplete : true});
              }else{
                _this.setState({editProfile : false, profileComplete : false});
              }
            var userData = Util.getUserData();
            var photoUrl = response.data.Data.job_seeker_info.network.photo;
            if(userData){
              userData.userImage = photoUrl;
              // userData.userImage && (userData.userImage = response.data.s3BucketUrl + userData.userImage);
              _this.setState({userImage : (userData.userImage && (response.data.s3BucketUrl + userData.userImage))});
              cookieManager.setCookie('userData', JSON.stringify(userData));
            }
            _this.setState({completeStatus : response.data.Data.job_seeker_info.last_visited_page});
              if(response.data.Data.job_seeker_info.network){
                _this.setState({network : response.data.Data.job_seeker_info.network});
              }
              if(!!response.data.Data.job_seeker_info.network.resume){
                _this.state.resumeLink = response.data.Data.job_seeker_info.network.resume
                var resumeName = _this.state.resumeLink.substr(_this.state.resumeLink.lastIndexOf('/') + 1);
                _this.setState({resumeName : resumeName, resumeLink: _this.state.resumeLink});
              }
              if(response.data.Data.job_seeker_info.network.writing_samples.length>0){
                _this.setState({alreadyAccepted : response.data.Data.job_seeker_info.network.writing_samples});
              }
              if(!!photoUrl){
                _this.state.photoLink = response.data.s3BucketUrl + photoUrl;
               // var photoName = photoLink.substr(photoLink.lastIndexOf('/') + 1);
                if(_this.state.photoLink){
                  _this.state.deleteDisabled = false;
                }else{
                  _this.state.deleteDisabled = true;
                }
                _this.setState({croppedImg : _this.state.photoLink, deleteDisabled : _this.state.deleteDisabled, photoLink: _this.state.photoLink});
              }
              // else{
              //   _this.setState({croppedImg : "/images/upload_image_placeholder.png", deleteDisabled : true});
              // }
            }else{
               console.log("error : ",response.data.Message)
            }
            _this.setState({loaded:true});
        }
      })
    });
  }

  componentDidMount() {
    window.scrollTo(0,0);
    this.setState({seekeractive : 'tab-btn-blue'});
    this.setState({posteractive : 'tab-btn-white'});
    if(cookieManager.getCookie('seekeractive')){
      this.setState({seekeractive : cookieManager.getCookie('seekeractive')});
      this.setState({posteractive : cookieManager.getCookie('posteractive')})
    }
   $('input[type="file"]').attr("title", " ");
   var userData = Util.getUserData();
  	if(userData){
  	  this.setState({token : userData.token , userId : userData.userId});
  	}
    this.getUserProfile();

  }

  deleteFile(from, index){
    if(from == 'accepted'){
      this.state.accepted.splice(index, 1);
      this.setState({accepted : this.state.accepted});
    }
    else if(from == 'alreadyAccepted'){
      this.state.alreadyAccepted.splice(index, 1);
      this.setState({alreadyAccepted : this.state.alreadyAccepted});
    }
    else{
      this.state.rejected.splice(index, 1);
      this.setState({rejected : this.state.rejected});
      if(this.state.rejected.length == 0){
        let error = this.state.formErrors;
        error.writing_samples = "";
        this.setState({sampleValid : true,formErrors : error})
      }else{
        this.setState({sampleValid : false});
      }
    }
  }


  _handleClick(e) {
    // e.preventDefault();
    // console.log("click")
       let callFrom = e.target.name;
       let fieldValidationErrors = this.state.formErrors;
       let networkData = this.state.network;
       switch('photo') {
          case 'photo':
            if(fieldValidationErrors.photo == ''){
              this.state.photoValid = true;
              this.state.formErrors.photo = "";

            }else{
              this.state.photoValid = false;
              // this.state.photoValid = true;
              // this.state.formErrors.photo = "";
            }
          case 'lawyer_headline':
            if(!!networkData.lawyer_headline){
            	if(networkData.lawyer_headline.length <= 150){
            		this.state.lawerHeadlineValid = true;
            		fieldValidationErrors.lawyer_headline = '';
            	}else{
            		this.state.lawerHeadlineValid = false;
			          fieldValidationErrors.lawyer_headline = CONST.INVALID_LAWYER_HEADLINE_LENGTH;
            	}
		        }
		        else{
		        	this.state.lawerHeadlineValid = true;
		          fieldValidationErrors.lawyer_headline = '';
		        }

          case 'about_lawyer':
            if(!!networkData.about_lawyer){
            	if(networkData.about_lawyer.length <= 700){
            		this.state.aboutLawyerValid = true;
            		fieldValidationErrors.about_lawyer = '';
            	}
            	else{
            		this.state.aboutLawyerValid = false;
            		fieldValidationErrors.about_lawyer = CONST.INVALID_ABOUT_ME_LENGTH;
            	}
            }else{
            	this.state.aboutLawyerValid = true;
            	fieldValidationErrors.about_lawyer = '';
            }
          case 'linkedin_link':
            if(!!networkData.linkedin_link){
              let link = networkData.linkedin_link.toLowerCase();
              if(link.indexOf('linkedin') >= 0){
                this.state.linkedinValid = true;
                fieldValidationErrors.linkedin_link = '';
              }else{
                this.state.linkedinValid = false;
                fieldValidationErrors.linkedin_link = CONST.INVALID_LINKEDIN_LINK;
              }
            }else{
              this.state.linkedinValid = true;
            	fieldValidationErrors.linkedin_link = '';
            }

          case 'resume':
            if(fieldValidationErrors.resume == ''){
              this.state.resumeValid = true;
              this.state.formErrors.resume = "";
            }else{
              this.state.resumeValid = false;
            }

            break;
          default:
            break;
        }


       this.setState({formErrors: fieldValidationErrors,
                        photoValid: this.state.photoValid,
                        lawerHeadlineValid: this.state.lawerHeadlineValid,
                        aboutLawyerValid: this.state.aboutLawyerValid,
                        linkedinValid: this.state.linkedinValid,
                        resumeValid: this.state.resumeValid,
                        sampleValid: this.state.sampleValid,
                        photoUpdate : this.state.photoUpdate,
                        resumeUpdate : this.state.resumeUpdate
                      });
      // console.log(this.state.sampleValid ,this.state.photoValid ,this.state.lawerHeadlineValid , this.state.aboutLawyerValid , this.state.linkedinValid , this.state.clioValid , this.state.resumeValid)
          if(this.state.photoValid && this.state.lawerHeadlineValid && this.state.aboutLawyerValid && this.state.linkedinValid && this.state.resumeValid && this.state.sampleValid){
            // console.log("inside here")
              const data = {};
              data.job_seeker_info = {};
              data.job_seeker_info.network = this.state.network;
              data.job_seeker_info.network.photo= this.state.imgObj;
              data.job_seeker_info.network.writing_samples = this.state.accepted;
              if(this.state.resumeUpdate == false){
                data.job_seeker_info.network.resume = this.state.resumeLink;
              }else{
                data.job_seeker_info.network.resume = this.state.resumeObj;
              }
              data.job_seeker_info.network.userId = this.state.userId;
              if(this.state.photoUpdate == false){
                data.job_seeker_info.network.photo = this.state.photoLink;
              }else{
                data.job_seeker_info.network.photo = this.state.imgObj;
              }
              data.job_seeker_info.network.photoUpdate = this.state.photoUpdate;
              data.job_seeker_info.network.resumeUpdate = this.state.resumeUpdate;
              data.job_seeker_info.network.alreadyAddedSample = this.state.alreadyAccepted;
              var _this = this;

              this.setState({loaded:false},function(){
                ApiCall('post','/userNetworkProfile',data,Util.getToken(), function(err, response){
                  Util.showHideFlashMsg();
                  if(err){
                    console.log("error : ",err)
                    _this.setState({loaded:true});
                  }else{
                    _this.setState({loaded:true});
                    if(response.data.Code == 200 && response.data.Status == true){
                      if(callFrom == "save")
                      {

                        _this.setState({resSuccess : true, resError: false, message : CONST.SUCCESS_UPDATE_PROFILE});
                        _this.getUserProfile();

                        // Util.refreshPage();
                      }else{
                        Util.changeUrl('/attorney-profile-job-type');
                      }
                    }else{
                       _this.setState({resSuccess : false, resError: true, message : response.data.Message});
                      console.log(response.data.Message);
                    }
                  }
                })
              })

          }
    }

  handleInputOnBlur(e){
        this.validateField(e.target.name, e.target.value);
    }

  handleUserInput(e){
  	let network = Object.assign({}, this.state.network);
		network[e.target.name] = e.target.value;
		this.setState({network});
  }

handleFileChange(dataURI, imgObj) {
  let fieldValidationErrors = this.state.formErrors;
  // console.log(dataURI, imgObj)
  if(imgObj.size/1000000 > 10){
    fieldValidationErrors.photo = CONST.IMAGE_SIZE_ERROR;
    this.state.photoValid = false;
    var cropperOpenStatus = false;
    // this.setState({cropperOpen: false});
  }else{
    fieldValidationErrors.photo = '' ;

    this.state.photoValid = true;
    // this.setState({cropperOpen: true});
    var cropperOpenStatus = true;
  }
  // console.log(this.state.croppedImg);
    this.setState({
      img: dataURI,
      croppedImg: this.state.croppedImg,
      imgObj : imgObj,
      formErrors : fieldValidationErrors,
      photoValid : this.state.photoValid,
      cropperOpen : cropperOpenStatus
    });

   // console.log("imgObj : ",imgObj);

  }
    handleCrop(dataURI) {
      let photoObj = {};
      photoObj.dataUrl = dataURI;
      photoObj.name = this.state.imgObj.name;
      photoObj.size = this.state.imgObj.size;
      photoObj.type = this.state.imgObj.type;
      this.setState({
        cropperOpen: false,
        img: null,
        croppedImg: dataURI,
        imgObj : photoObj,
        photoUpdate : true,
        deleteDisabled : false
      });


   // console.log("here dataUri : ", dataURI)
  }
  handleRequestHide() {
    this.setState({
      cropperOpen: false,
      isMounted: false
    });

  }

  deleteImage(){
    let error = this.state.formErrors;
    error.photo = "";
    this.state.imgObj = {};
    this.setState({photoValid : true,formErrors : error, img: null, croppedImg: "/images/upload_image_placeholder.png", imgObj : this.state.imgObj , photoUpdate : true , deleteDisabled : true});
    $('#myModal').modal('hide');
  }

  expandHide(param){
    if(param == "expand"){
      this.setState({expand : false});
    }else{
      this.setState({expand : true});
    }
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let networkData = this.state.network;
     switch(fieldName) {
          case 'photo':
            if(fieldValidationErrors.photo == ''){
              this.state.photoValid = true;
              this.state.formErrors.photo = "";
            }else{
              this.state.photoValid = false;
              // this.state.photoValid = true;
              // this.state.formErrors.photo = "";
            }
            break;
          case 'lawyer_headline':
            if(!!networkData.lawyer_headline){
            	if(networkData.lawyer_headline.length <= 150){
            		this.state.lawerHeadlineValid = true;
            		fieldValidationErrors.lawyer_headline = '';
            	}else{
            		this.state.lawerHeadlineValid = false;
			          fieldValidationErrors.lawyer_headline = CONST.INVALID_LAWYER_HEADLINE_LENGTH;
            	}
		        }
		        else{
		        	this.state.lawerHeadlineValid = false;
		          fieldValidationErrors.lawyer_headline = '';
		        }
		        break;
          case 'about_lawyer':
            if(!!networkData.about_lawyer){
            	if(networkData.about_lawyer.length <= 700){
            		this.state.aboutLawyerValid = true;
            		fieldValidationErrors.about_lawyer = '';
            	}
            	else{
            		this.state.aboutLawyerValid = false;
            		fieldValidationErrors.about_lawyer = CONST.INVALID_ABOUT_ME_LENGTH;
            	}
            }else{
            	this.state.aboutLawyerValid = true;
            	fieldValidationErrors.about_lawyer = '';
            }
            break;
          case 'linkedin_link':
            if(!!networkData.linkedin_link){
              let link = networkData.linkedin_link.toLowerCase();
              if(link.indexOf('linkedin') >= 0){
                this.state.linkedinValid = true;
                fieldValidationErrors.linkedin_link = '';
              }else{
                this.state.linkedinValid = false;
                fieldValidationErrors.linkedin_link = CONST.INVALID_LINKEDIN_LINK;
              }
            }else{
            	fieldValidationErrors.linkedin_link = '';
            }
            break;
          case 'resume':
            if(fieldValidationErrors.resume == ''){
              this.state.resumeValid = true;
              this.state.formErrors.resume = "";
            }else{
              this.state.resumeValid = false;
            }
            break;
          case 'writing_samples':
            if(fieldValidationErrors.writing_samples == ''){
              this.state.sampleValid = true;
              this.state.formErrors.writing_samples = "";
            }else{
              this.state.sampleValid = false;
            }
            break;
          default:
            break;
        }
     this.setState({formErrors: fieldValidationErrors,
                        photoValid: this.state.photoValid,
                        lawerHeadlineValid: this.state.lawerHeadlineValid,
                        aboutLawyerValid: this.state.aboutLawyerValid,
                        linkedinValid: this.state.linkedinValid,
                        resumeValid: this.state.resumeValid,
                        sampleValid: this.state.sampleValid
                      }, this.validateForm);
  }

  validateForm() {

    this.setState({formValid: this.state.photoValid && this.state.lawerHeadlineValid && this.state.aboutLawyerValid && this.state.linkedinValid && this.state.resumeValid && this.state.sampleValid});
  }


render(){
    return (
      <div>
        <Commonheader userImage={this.state.userImage}  />
        <div className="pro-basic-info network-profile content-wrapper container">

         <TopContent thisObj={this} active={this.state.seekeractive} inactive={this.state.posteractive}  showP = {Util.showpop} headTitle="Headline + Additional Info" content="Next, please create your Legably profile headline and provide a brief bio, your resume, and writing samples or other sample work-product (optional)."/>

        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={()=>Util.changeUrl("/attorney-profile-experience")}></span> Headline + Additional Info <span className={this.state.completeStatus >= 3 ? 'next' : 'next disabled-element'} onClick={()=>Util.changeUrl('/attorney-profile-job-type')}></span></div>

       <ProfileBullet currentProfilePage="3" completeStatus={this.state.completeStatus} profileComplete={this.state.profileComplete}/>
        <div className="network-form form">

          <div className="network-card card">
            <h4>Headline + Additional Info</h4>
            <div className="upload-photo">

              <div className="form-group">
                <div className="avatar-photo">
                  <FileUpload handleFileChange={this.handleFileChange} />
                  <img src={this.state.croppedImg} onError={this.profileImgError} />
                </div>
                {this.state.cropperOpen &&
                  <AvatarCropper onRequestHide={this.handleRequestHide} cropperOpen={this.state.cropperOpen}
                    onCrop={this.handleCrop} image={this.state.img} width={200} height={200}
                  />
                }
              </div>
              <span className={this.state.deleteDisabled ? 'd-none' : "d-block"} data-toggle="modal" data-target="#myModal" data-backdrop="static"> <img src="/images/svg-IMAGES/error.svg"/> </span>
              <div className={this.state.formErrors.photo !== '' ? 'caption global-error' : 'caption'}>upload photo
               <p><span>{this.state.formErrors.photo !== '' ? this.state.formErrors.photo : ''}</span></p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <div className="row m-0">
                  <div className={this.state.formErrors.lawyer_headline !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="lawyer-head" className="control-label">My Headline</label>
                    <textarea id="lawyer-head" name="lawyer_headline"  value={this.state.network.lawyer_headline} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} className="form-control" placeholder="Please create a brief headline for your Legably profile"></textarea>
                    <p><span>{this.state.formErrors.lawyer_headline !== '' ? this.state.formErrors.lawyer_headline : ''}</span></p>
                  </div>
                </div>
                <div className="row m-0">
                  <div className={this.state.formErrors.linkedin_link !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="linkedin-link" className="control-label">LinkedIn</label>
                    <input type="text" name="linkedin_link"  value={this.state.network.linkedin_link} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} id="linkedin-link" className="form-control" placeholder="LinkedIn" />
                    <p><span>{this.state.formErrors.linkedin_link !== '' ? this.state.formErrors.linkedin_link : ''}</span></p>
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className={this.state.formErrors.about_lawyer !== '' ? 'form-group global-error' : 'form-group'}>
                  <label htmlFor="about-lawyer" className="control-label">About Me</label>
                  <textarea id="about-lawyer" name="about_lawyer"  value={this.state.network.about_lawyer} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} className="form-control about-lawyer" placeholder="Please tell us a bit about you, your background and experience, and the types of opportunities you're seeking"></textarea>
                  <p><span>{this.state.formErrors.about_lawyer !== '' ? this.state.formErrors.about_lawyer : ''}</span></p>
                </div>
              </div>
            </div>

            <div className="row">

              <div className={this.state.formErrors.resume !== '' ? 'col-sm-6 upload-document global-error' : 'col-sm-6 upload-document'}>

               <div className="dropzone">
                    <Dropzone
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onDrop={this.onDropFile} maxSize={this.state.maxSize} multiple={this.state.multiple} />

                      <div className={(this.state.resumeName != '' ) ? "m-0 form-group row d-none" : "m-0 form-group row d-block"}>
                        <span className="d-inline-block">
                          <img src="/images/upload-doc.png" alt="upload-doc" className="img-responsive pull-right" />
                        </span>
                        <span className="p-5 d-inline-block">
                          <h4>Upload your resume</h4>
                          <p>Drag and Drop  or Click to Select</p>
                        </span>
                      </div>
                  <aside className={(this.state.resumeName != '') ? "pt-50 d-block" : "d-none"}>

                    <ul>
                      <li>
                          <i className="fa fa-file-text-o" aria-hidden="true"></i>
                          <span title={this.state.resumeName} className="trunc">{this.state.resumeName}</span>
                          <span onClick={this.deleteResume}>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                          </span>
                      </li>
                    </ul>
                  </aside>
                </div>
                  <div className="supports">Supported Format: Pdf, Doc | Size 3 MB</div>
                  <p><span className="m-0">{this.state.formErrors.resume  !== '' ? this.state.formErrors.resume : ''}</span></p>
              </div>

              <div className={this.state.formErrors.writing_samples !== '' ? 'col-sm-6 upload-document global-error' : 'col-sm-6 upload-document'}>

                  <div className="dropzone">
                    <Dropzone
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onDrop={this.onDrop} maxSize={this.state.maxSize} />

                     <div className={(this.state.alreadyAccepted.length > 0 || this.state.accepted.length > 0 || this.state.rejected.length > 0) ? "m-0 form-group row d-none" : "m-0 form-group row d-block"}>
                        <span className="d-inline-block">
                          <img src="/images/upload-doc.png" alt="upload-doc" className="img-responsive pull-right" />

                        </span>
                        <span className="p-5 d-inline-block">
                          <h4>Upload writing samples</h4>
                          <p>Drag and Drop  or Click to Select</p>
                        </span>
                      </div>
                     <aside className={(this.state.alreadyAccepted.length > 0 || this.state.accepted.length > 0 || this.state.rejected.length > 0) ? "d-block" : "d-none"}>
                       <div className={this.state.expand ? "file-wrapper" : "file-wrapper max-height-255"}>
                       <ul>
                          {
                            this.state.alreadyAccepted.map((f,index) => <li key={index}> <i className="fa fa-file-text-o" aria-hidden="true"></i> <span className="trunc" title={f.name}>{f.name}</span> <span onClick={(e) => this.deleteFile('alreadyAccepted',index)}> <i className="fa fa-trash-o" aria-hidden="true"></i></span></li>   )
                          }
                        </ul>
                        <ul>
                          {
                            this.state.accepted.map((f,index) => <li key={index}> <i className="fa fa-file-text-o" aria-hidden="true"></i> <span className="trunc" title={f.name}>{f.name}</span> <span onClick={(e) => this.deleteFile('accepted',index)}> <i className="fa fa-trash-o" aria-hidden="true"></i></span></li>   )
                          }
                        </ul>
                        <ul>
                          {
                            this.state.rejected.map((f,index) => <li key={index}> <i className="fa fa-file-text-o" aria-hidden="true"></i> <span className="trunc" title={f.name}>{f.name}</span> <span onClick={(e) => this.deleteFile('rejected',index)}> <i className="fa fa-trash-o" aria-hidden="true"></i> </span><p><span>{f.error}</span></p></li> )
                          }
                        </ul>
                        </div>
                        <p className={(this.state.alreadyAccepted.length + this.state.accepted.length + this.state.rejected.length) > 1 ? "drag-drop pull-left" : "drag-drop"}>Drag and Drop or Click to Select</p>
                        <div className="expand-hide-list pull-right">
                          <a className={this.state.expand && ((this.state.alreadyAccepted.length + this.state.accepted.length + this.state.rejected.length) > 1) ? "expand-list" : "expand-list d-none"} onClick={()=>this.expandHide('expand')}>Show More</a>
                          <a className={!this.state.expand && ((this.state.alreadyAccepted.length + this.state.accepted.length + this.state.rejected.length) > 1) ? "hide-list" : "hide-list d-none"} onClick={()=>this.expandHide('hide')}>Show Less</a>
                        </div>
                      </aside>
                  </div>

                      <p><span className="d-none m-0">{this.state.formErrors.writing_samples  !== '' ? this.state.formErrors.writing_samples : ''}</span></p>
                    <div className="supports">
                      <span className="pull-right">Supported Format: Pdf, Doc | Size 3 MB</span>
                    </div>
              </div>
            </div>

          </div>

          <div className="nxt-prev-btns">
            <button type="button" onClick={()=>Util.changeUrl("/attorney-profile-experience")} className="previouse-btn btn pull-left"> Previous </button>
            <div className={this.state.editProfile == true ? "d-block" : "d-none"}>
                <button type="button" name="save&Next" className="nxt-btn btn-blue btn pull-right" onClick={this._handleClick}> Save & Next </button >
                <button type="button" name="save" className="nxt-btn btn-blue btn pull-right mr-1p" onClick={this._handleClick}> Save </button >
                <button type="button" className="nxt-btn btn-white btn pull-right mr-1p" onClick={()=>Util.refreshPage()}> Cancel </button>
              </div>
              <button type="submit" name="save&Next" onClick={this._handleClick} className={this.state.editProfile == true ? "d-none nxt-btn btn pull-right" : "d-block nxt-btn btn-blue btn pull-right"}> Next </button >
            <span className="clear-fix"></span>
          </div>
        </div>

      </div>

      <div className="del-photo-modal modal fade in" id="myModal" role="dialog">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              <p>Are you sure you want to delete photo?</p>
            </div>
            <div className="modal-footer">
              <button className="btn-blue btn" onClick={this.deleteImage}>Ok</button>
              <button className="btn-default btn" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      {this.state.showPopup ?
          <Popup
            url={'/attorney-profile-headline'}
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





export default NetworkProfile;
