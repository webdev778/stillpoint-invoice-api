import React from 'react';
import {ApiCall} from '../server/config/util.js';
import { Link, browserHistory } from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
var Loader = require('react-loader');
import Util from '../common/Util.js';
import CONST from '../common/Const.js';

class ChangePassword extends React.Component {
	constructor (props) {
    super(props);
    this.state = {
      old_password: '',
      password: '',
      confirm_password : '',
      formErrors: {old_password: '', password: '', confirm_password: ''},
      opasswordValid: false,
      passwordValid: false,
      cpasswordValid: false,
      formValid: false,
      resError : false,
      resSuccess : false,
      message : '',
      loaded:true,
      showOldPass : false,
      showNewPass : false,
      showRePass : false,
  	};
    	this._handleClick = this._handleClick.bind(this);
      this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
      this.handleUserInput = this.handleUserInput.bind(this);
      this.validateForm = this.validateForm.bind(this);
      this.validateField = this.validateField.bind(this);
      this.showOldPassword = this.showOldPassword.bind(this);
      this.showNewPassword = this.showNewPassword.bind(this);
      this.showRePassword = this.showRePassword.bind(this);
      this.logout = this.logout.bind(this);
  }

    showOldPassword() {
      if(this.state.showOldPass){
        document.getElementById("crnt-pwd").setAttribute("type", "password");
        this.setState({
          showOldPass: false
        });
      }else{
        document.getElementById("crnt-pwd").setAttribute("type", "text");
        this.setState({
          showOldPass: true
        });
      }
    }

    showNewPassword() {
      if(this.state.showNewPass){
        document.getElementById("new-pwd").setAttribute("type", "password");
        this.setState({
          showNewPass: false
        });
      }else{
        document.getElementById("new-pwd").setAttribute("type", "text");
        this.setState({
          showNewPass: true
        });
      }
    }

    showRePassword() {
      if(this.state.showRePass){
        document.getElementById("retype-pwd").setAttribute("type", "password");
        this.setState({
          showRePass: false
        });
      }else{
        document.getElementById("retype-pwd").setAttribute("type", "text");
        this.setState({
          showRePass: true
        });
      }
    }


  _handleClick(e) {
    e.preventDefault();
    //console.log(e.target);
    if(e.target.name == "cancel"){
      Util.changeUrl('/attorney-profile-basic-info');
    }
       let fieldValidationErrors = this.state.formErrors;
        switch('old_password') {
          case 'old_password':
            if(!this.state.old_password){
              this.state.opasswordValid = false;
              fieldValidationErrors.old_password = this.state.opasswordValid ? '': CONST.ENTER_CURR_PASS;
            }
          case 'password':
            if(!this.state.password){
              this.state.passwordValid = false;
              fieldValidationErrors.password = this.state.passwordValid ? '': CONST.ENTER_NEW_PASS;
            }
          case 'confirm_password':
            if(!this.state.confirm_password){
              this.state.cpasswordValid = false;
              fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': CONST.ENTER_RETYPE_PASS;
            }
            else if(this.state.password != this.state.confirm_password){
              this.state.cpasswordValid = false;
              fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': CONST.PASS_NOT_MATCH;
            }
          
            break;
          default:
            break;
        }

        this.setState({formErrors: fieldValidationErrors,
                        opasswordValid: this.state.opasswordValid,
                        passwordValid: this.state.passwordValid,
                        cpasswordValid: this.state.cpasswordValid,
                       }, this.validateForm);
          if(this.state.formValid && (this.state.old_password && this.state.password == this.state.confirm_password)){
              const data = {};
              var _this = this;
              data.old_password = this.state.old_password;
              data.password = this.state.password;
              data.confirm_password = this.state.confirm_password;
              this.setState({loaded:false});
              ApiCall('post','/changePassword',data, Util.getToken(), function(err, response){
                if(err){
                  _this.setState({resSuccess : false, resError: true, message : err});
                  _this.setState({loaded:true});
                }else{
                  console.log(response);
                  if(response.data.Code == 200 && response.data.Status == true){
                    _this.setState({old_password: '',password: '',confirm_password : ''});
                    _this.setState({resSuccess : true, resError: false, message : response.data.Message});
                    $('#myModal').modal('show');
                  }else{
                   _this.setState({resSuccess : false, resError: true, message : response.data.Message});
                  }
                  _this.setState({loaded:true});
                }
              })

          }
    }

    logout(){
      ApiCall('post','/logout',{},Util.getToken(), function(error, resp){
        if(error){
          this.setState({resSuccess : false, resError: true, message : error});
        }else{
          if(resp.data.Code == 200 && resp.data.Status == true){
            Util.rememberMeFunc();
          }else{
             this.setState({resSuccess : false, resError: true, message : error});
          }
        }
      })
    }

  handleInputOnBlur(e){
    this.setState({[e.target.name]: e.target.value});
    this.validateField(e.target.name, e.target.value);
  }

  handleUserInput(e){
    this.setState({[e.target.name]: e.target.value});
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;

    switch(fieldName) {
      case 'old_password':
        if(!value){
          this.state.opasswordValid = false;
          fieldValidationErrors.old_password = this.state.opasswordValid ? '': CONST.ENTER_CURR_PASS;
        }else{
          this.state.opasswordValid = true;
          fieldValidationErrors.old_password = '';
        }
        break;
      case 'password':
        if(value){
          if(value.length >= 8){
           const PASSWORD_REGEXP = /^(?=.{8,})(?=.*[a-zA-Z0-9!@#$%^&*()]).*$/;
                if(PASSWORD_REGEXP.test(value)){
                  var count = 1, counter = 1;
                  for(var i=0; i<value.length; i++){
                    if(value[i] == value[i+1]){
                      count++;
                    }else{
                      if(Math.abs(value.charCodeAt(i+1) - value.charCodeAt(i)) === 1){
                        counter++;
                      }else{
                        this.state.passwordValid = true;
                        fieldValidationErrors.password = '';
                      }
                    }

                   if(count == value.length){
                      this.state.passwordValid = false;
                      fieldValidationErrors.password = this.state.passwordValid ? '': CONST.INVALID_SINGLE_CHAR_PASS;
                    }else if(counter == value.length){
                      this.state.passwordValid = false;
                      fieldValidationErrors.password = this.state.passwordValid ? '': CONST.INVALID_CONSECUTIVE_PASS;
                    }
                  }
                }else{
                  this.state.passwordValid = false;
                  fieldValidationErrors.password = this.state.passwordValid ? '': CONST.INVALID_PASS_LENGTH;
                }
          }else{
            this.state.passwordValid = false;
            fieldValidationErrors.password = this.state.passwordValid ? '': CONST.INVALID_PASS_LENGTH;
          }
        }else{
          this.state.passwordValid = false;
          fieldValidationErrors.password = this.state.passwordValid ? '': CONST.ENTER_NEW_PASS;
        }
        break;
      case 'confirm_password':
        if(value){
            this.state.cpasswordValid = (value == this.state.password ? true : false);
            fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': CONST.PASS_NOT_MATCH;
          }else{
            this.state.cpasswordValid = false;
          fieldValidationErrors.confirm_password = this.state.cpasswordValid ? '': CONST.ENTER_RETYPE_PASS;
        }
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    opasswordValid: this.state.opasswordValid,
                    passwordValid: this.state.passwordValid,
                    cpasswordValid: this.state.cpasswordValid,
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.opasswordValid && this.state.passwordValid && this.state.cpasswordValid});
  }
	render(){
    return (
      <div className="change-password-wrapper">
     
        <Commonheader />
        <div className="change-password content-wrapper container">
          <form className="form change-password-form" onSubmit={this._handleClick}>
            <div className="change-password-card card">
              <h4>Change Password</h4>
              <p>It’s a good idea to use a strong password that you don’t use elsewhere.</p>
              <div className="max-450">
                <div className="row">
                  <div className="col-xs-12">
                    <div className={this.state.formErrors.old_password !== '' ? 'form-group global-error' : 'form-group'}>
                      <label htmlFor="crnt-pwd" className="control-label">Current Password</label>
                      <div className="pwd-wrapper">
                        <input type="password" id="crnt-pwd" className="pswd form-control" placeholder="Current Password" name="old_password" value={this.state.old_password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                        <span onClick={this.showOldPassword} className="eye"><i className={this.state.showOldPass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                        
                      </div> 
                      <p><span>{this.state.formErrors.old_password !== '' ? this.state.formErrors.old_password : ''}</span></p>
                    </div>
                  </div>
                  <div className="col-xs-12">
                    <div className={this.state.formErrors.password !== '' ? 'form-group global-error' : 'form-group'}>
                      <label htmlFor="new-pwd" className="control-label">New Password</label>
                      <div className="pwd-wrapper">
                        <input type="password" id="new-pwd" className="pswd form-control" placeholder="New Password" name="password" value={this.state.password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                        <span onClick={this.showNewPassword} className="eye"><i className={this.state.showNewPass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                        
                      </div>
                      <p><span>{this.state.formErrors.password !== '' ? this.state.formErrors.password : ''}</span></p>
                    </div>
                  </div>
                  <div className="col-xs-12">
                     <div className={this.state.formErrors.confirm_password !== '' ? 'form-group global-error' : 'form-group'}>
                      <label htmlFor="retype-pwd" className="control-label">Retype New Password</label>
                      <div className="pwd-wrapper">
                        <input type="password" id="retype-pwd" className="pswd form-control" placeholder="Retype New Password" name="confirm_password" value={this.state.confirm_password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                        <span onClick={this.showRePassword} className="eye"><i className={this.state.showRePass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                        
                      </div>
                      <p><span>{this.state.formErrors.confirm_password !== '' ? this.state.formErrors.confirm_password : ''}</span></p>
                    </div>
                  </div>
                  <div className="btns col-xs-12">
                    <button type="submit" className="btn-blue"> Save Changes </button>
                    <button type="button" name="cancel" className="btn-default" onClick={this._handleClick}> Cancel </button>
                  </div>
                </div>
              </div>
              
              {this.state.resError == true ? (<div className="alert alert-danger">{this.state.message}</div>): ''}
            </div>
            </form>
          </div>
          <Commonfooter />
         <div className={this.state.loaded ? 'fade-layer d-none' : 'fade-layer'}>
           <div className="loader"></div>
          </div>

          <div className="del-photo-modal modal fade in" id="myModal" role="dialog">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body">
                  <p>{this.state.message}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn-blue btn" data-dismiss="modal" onClick={this.logout}>Ok</button>
                </div>
              </div>
            </div>
          </div>


        </div>

    );
  }
}

export default ChangePassword;