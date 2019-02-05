import React from 'react';
import SignInImageContainer from './SignInImageContainer.jsx';
import { Link, browserHistory} from 'react-router';
import {ApiCall} from '../server/config/util.js';
var Loader = require('react-loader');
import cookieManager from '../common/cookieManager';
import CONST from '../common/Const.js';
import Util from '../common/Util.js';
import Commonfooter from './footer.jsx';

class Signin extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded : true,
      email: '',
      password: '',
      rememeberMe : false,
      formErrors: {email: '', password: ''},
      emailValid: false,
      passwordValid: false,
      formValid: false,
      resError : '',
      showPass : false,
    };
    this._handleClick = this._handleClick.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.showPassword = this.showPassword.bind(this);
    this.changeUrl = this.changeUrl.bind(this);

    }

  changeUrl(url){
    browserHistory.push(url);
  }


    componentDidMount() {
     window.scrollTo(0,0);
     //console.log(cookieManager.getCookie('rememeberMe'));
     if(cookieManager.getCookie('rememeberMe')){
        let userData = {};
        userData = JSON.parse(cookieManager.getCookie('rememeberMe'));
        userData.password = atob(userData.password);
        this.setState({rememeberMe : true , email : userData.email.toString() , password : userData.password.toString()});
        this.validateField('email', userData.email);
        this.validateField('password', userData.password);
      }
      if($('footer').length == 0){

      $('body').css({'padding-bottom':"0px"});  // sticky footer
      }
    }

    showPassword() {
      if(this.state.showPass){
        document.getElementById("pwd").setAttribute("type", "password");
        this.setState({
          showPass: false
        });
      }else{
        document.getElementById("pwd").setAttribute("type", "text");
        this.setState({
          showPass: true
        });
      }
    }

   _handleClick(e) {
    e.preventDefault();
       let fieldValidationErrors = this.state.formErrors;
        switch('email') {

          case 'email':
            if(!this.state.email){
              this.state.emailValid = false;
              fieldValidationErrors.email = this.state.emailValid ? '' : CONST.ENTER_EMAIL;
            }
         case 'password':
            if(!!this.state.password){
              this.state.passwordValid = true;
              fieldValidationErrors.password = '';
            }else{
              this.state.passwordValid = false;
              fieldValidationErrors.password = this.state.passwordValid ? '': CONST.ENTER_PASSWORD;
            }

            break;
          default:
            break;
        }

        this.setState({formErrors: fieldValidationErrors,
                        emailValid: this.state.emailValid,
                        passwordValid: this.state.passwordValid,
                      }, this.validateForm);
          if(this.state.emailValid && this.state.passwordValid){
              const data = {};
              var _this = this;
              data.email = this.state.email.toLowerCase().trim();
              data.password = this.state.password;
              this.setState({loaded:false},function(){
               ApiCall('post','/login',data,'', function(err, response){
                 if(err){
                   console.log("error : ",err)
                   _this.setState({loaded:true});
                 }else{
                   console.log(response);
                   if(response.data.Code == 200 && response.data.Status == true){
                       if(_this.state.rememeberMe){
                        cookieManager.setCookie('rememeberMe',JSON.stringify({email: _this.state.email, password : btoa(_this.state.password)}));
                       }else{
                         cookieManager.deleteCookie('rememeberMe');
                       }
                       cookieManager.setCookie('userData',JSON.stringify(response.data.Data));
                      Util.getUserData()['role'] === 'admin' ? _this.changeUrl('/admin-dashboard') : Util.redirectionHandle();
                   }else {
                      Util.showHideFlashMsg();
                     _this.setState({resError: true});
                   }
                   _this.setState({loaded:true});
                 }
               })
              });

          }
    }

    handleUserInput(e){
      this.setState({[e.target.name]: e.target.value});
    }


   handleInputChange(e) {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      this.setState({
        [e.target.name]: value
      });

    }

    handleInputOnBlur(e){
      this.setState({[e.target.name]: e.target.value});
      this.validateField(e.target.name, e.target.value);
    }

      validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let userData = this.state.userData;

        switch(fieldName) {
          case 'email':
            if(value){
              this.state.emailValid = value.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
              fieldValidationErrors.email = this.state.emailValid ? '' : CONST.INVALID_EMAIL_ADD;
              // if(fieldValidationErrors.email == '' && value == userData.email){
              //  this.setState({password : userData.password});
              //  this.validateField('password', userData.password);
              // }
            }else{
              this.state.emailValid = false;
              fieldValidationErrors.email = this.state.emailValid ? '' : CONST.ENTER_EMAIL;
            }
            break;
          case 'password':
            if(!value){
              this.state.passwordValid = false;
              fieldValidationErrors.password = this.state.passwordValid ? '': CONST.ENTER_PASSWORD;
            }else{
              this.state.passwordValid = true;
              fieldValidationErrors.password = '';
            }
            break;
          default:
            break;
        }
        this.setState({formErrors: fieldValidationErrors,
                        emailValid: this.state.emailValid,
                        passwordValid: this.state.passwordValid,
                      }, this.validateForm);
      }

      validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
      }

  render(){
    return (
        <div className="sign-in-page-wrapper">
        <SignInImageContainer />

            <section className="sign-in-section pull-right">
            <div className="white-logo-bg"><img onClick={()=>this.changeUrl('/')  } src="images/primaryHorizontalRgb@2x.jpg" alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" /></div>
            <div className="form-wrapper">
              <h4>Sign In to Legably</h4>
              <form className="sign-in-form" onSubmit={this._handleClick}>
                <div className={this.state.formErrors.email !== '' ? 'form-group global-error' : 'form-group'}>
                  <label htmlFor="email">Email* </label>
                  <input type="text" className="form-control email-id" name="email"
                    placeholder="Enter your email"
                    value={this.state.email}
                    onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}  />
                  <p><span>{this.state.formErrors.email !== '' ? this.state.formErrors.email : ''}</span></p>
                </div>
                  <div className={this.state.formErrors.password !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="pwd">Password*</label>
                    <div className="pwd-wrapper">
                      <input type="password" id="pwd" className="pswd form-control" name="password" placeholder="Enter your password" value={this.state.password} onBlur={this.handleInputOnBlur} onChange={this.handleUserInput} />
                      <span onClick={this.showPassword} className="eye"><i className={this.state.showPass ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                    </div>
                    <p><span>{this.state.formErrors.password !== '' ? this.state.formErrors.password : ''}</span></p>
                  </div>
                <div className="form-group checkbox">
                  <label className="pmd-checkbox">
                    <input type="checkbox" name="rememeberMe" checked={this.state.rememeberMe} onChange={this.handleInputChange}/><span className="pmd-checkbox-label">&nbsp;</span>Remember me
                  </label>
                  <Link to="/forgotPassword">Forgot Password </Link>
                </div>
                <div className="btns">
                  <button type="submit" className="btn sign-in-btn">Sign In</button>
                  {/*<div className="or"><span>Or</span></div>
                                    <img src="images/linkedin.png" alt="Linked-in" />*/}
                </div>
              </form>

              <div className="already-signed">Don’t have an account? <Link to="/sign-up">Sign Up</Link></div>

              {this.state.resError == true ? (<div className="alert alert-danger fixed-alert top-0">Invalid Email or Password</div>): ''}
            </div>
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

export default Signin;
