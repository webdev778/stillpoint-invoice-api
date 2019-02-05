import React from 'react';
import {ApiCall} from '../server/config/util.js';
import { Link, browserHistory } from 'react-router';
import SignInImageContainer from './SignInImageContainer.jsx';
import CONST from '../common/Const.js';
import Commonfooter from './footer.jsx';

class ResetLinkSuccess extends React.Component {
	constructor (props) {
    super(props);
    this.state = {
      loaded : true,
      password: '',
      confirm_password : '',
      formErrors: {password: '',confirm_password: ''},
      passwordValid: false,
      cpasswordValid: false,
      formValid: false,
      message : '',
      resError : false,
      showPass : false,
      showRePass : false
      // resSuccess : false
  	};
  //  console.log("zdfsf",this.props.params.secretId)
  	this._handleClick = this._handleClick.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.showRePassword = this.showRePassword.bind(this);
    this.changeUrl = this.changeUrl.bind(this);
  }

  changeUrl(url){
    browserHistory.push(url);
  }

      showPassword() {
      if(this.state.showPass){
        document.getElementById("new-pwd").setAttribute("type", "password");
        this.setState({
          showPass: false
        });
      }else{
        document.getElementById("new-pwd").setAttribute("type", "text");
        this.setState({
          showPass: true
        });
      }
    }

    showRePassword() {
      if(this.state.showRePass){
        document.getElementById("re-pwd").setAttribute("type", "password");
        this.setState({
          showRePass: false
        });
      }else{
        document.getElementById("re-pwd").setAttribute("type", "text");
        this.setState({
          showRePass: true
        });
      }
    }

  _handleClick(e) {
      e.preventDefault();
       let fieldValidationErrors = this.state.formErrors;
        switch('password') {

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
                        passwordValid: this.state.passwordValid,
                        cpasswordValid: this.state.cpasswordValid,
                       }, this.validateForm);
          if(this.state.formValid && (this.state.password == this.state.confirm_password)){
            const data = {};
            var _this = this;
            data.password = this.state.password;
            data.confirm_password = this.state.confirm_password;
            this.setState({loaded:false});
            ApiCall('post','/resetPassword/'+this.props.secretId ,data,'', function(err, response){
              if(err){
                console.log("error : ",err);
                _this.setState({loaded:true});
              }else{
                console.log(response);
                if(response.data.Code == 200 && response.data.Status == true){
                  _this.changeUrl('/successChangePassword');
                }else{
                  _this.setState({resError: true, message : response.data.Message});
                }
                _this.setState({loaded:true});
              }
            })

          }
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
                    passwordValid: this.state.passwordValid,
                    cpasswordValid: this.state.cpasswordValid,
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.passwordValid && this.state.cpasswordValid});
  }
	render(){
    return (
        <div className="forgot-pwd-page-wrapper">

        <SignInImageContainer />
          <section className="forgot-pwd-section pull-right">

        <div className="white-logo-bg"><img onClick={()=>this.changeUrl('/')} src="/images/primaryHorizontalRgb@2x.jpg" alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" /></div>

        <div className="form-wrapper">
          <h4>Reset Password</h4>
          <p>It’s a good idea to use a strong password that you don’t use elsewhere.</p>
          <form className="forgot-pwd-form" onSubmit={this._handleClick}>
            <div className={this.state.formErrors.password !== '' ? 'form-group global-error' : 'form-group'}>
              <label htmlFor="new-pwd">New Password</label>
              <div className="pwd-wrapper">
                <input type="password" className="pswd form-control" id="new-pwd" placeholder="New Password" name="password" value={this.state.password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}/>
                <span onClick={this.showPassword} className="eye"><i className={this.state.showPass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>

              </div>
                <p><span>{this.state.formErrors.password !== '' ? this.state.formErrors.password : ''}</span></p>
            </div>
            <div className={this.state.formErrors.confirm_password !== '' ? 'form-group global-error' : 'form-group'}>
              <label htmlFor="re-pwd">Retype New Password</label>
              <div className="pwd-wrapper">
                <input type="password" className="pswd form-control" id="re-pwd" placeholder="Current New Password" name="confirm_password" value={this.state.confirm_password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}/>
                <span className="eye"><i className="fa fa-eye"></i></span>
               <span onClick={this.showRePassword} className="eye"><i className={this.state.showRePass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
              </div>
                <p><span>{this.state.formErrors.confirm_password !== '' ? this.state.formErrors.confirm_password : ''}</span></p>
            </div>

            <div className="btns">
              <button type="submit" className="btn btn-blue sign-in-btn">Submit</button>
            </div>
          </form>
          <Link to="/sign-in" className="already-signed">Back to Sign In</Link>
        </div>

        {this.state.resError == true ? (<div className="alert alert-danger">{this.state.message}</div>): ''}
      </section>
      <section className="clearfix"></section>
      <Commonfooter />
     <div className={this.state.loaded ? 'fade-layer d-none' : 'fade-layer'}>
             <div className="loader"></div>
            </div>
        </div>
    );
  }
}

export default ResetLinkSuccess;
