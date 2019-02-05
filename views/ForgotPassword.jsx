import React from 'react';
import {ApiCall} from '../server/config/util.js';
import { Link, browserHistory } from 'react-router';
import SignInImageContainer from './SignInImageContainer.jsx';
import cookieManager from '../common/cookieManager';
import CONST from '../common/Const.js';
import Commonfooter from './footer.jsx';

class ForgotPassword extends React.Component {
	constructor (props) {
    super(props);
    this.state = {
      email: '',
      loaded : true,
      formErrors: {email: ''},
      emailValid: false
  	};
  	this._handleClick = this._handleClick.bind(this);

    this.handleInputOnBlur = this.handleInputOnBlur.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.validateField = this.validateField.bind(this);
    this.changeUrl = this.changeUrl.bind(this);

  }

  changeUrl(url){
    browserHistory.push(url);
  }


  _handleClick(e) {
    e.preventDefault();
    console.log("click")
       let fieldValidationErrors = this.state.formErrors;
        if(!this.state.email){
          this.state.emailValid = false;
          fieldValidationErrors.email = this.state.emailValid ? '' : CONST.ENTER_EMAIL;
        }else if(!!this.state.email){
          this.state.emailValid = this.state.email.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
          fieldValidationErrors.email = this.state.emailValid ? '' : CONST.INVALID_EMAIL_ADD;
        }
        else{
          this.state.emailValid = true;

        }

        this.setState({formErrors: fieldValidationErrors,
                        emailValid: this.state.emailValid,
                       }, this.validateForm);

          if(this.state.emailValid){
            const data = {};
            var _this = this;
            data.email = this.state.email.toLowerCase().trim();
            this.setState({loaded:false});
            ApiCall('post','/forgotPassword',data,'', function(err, response){
              if(err){
                console.log(err);
                _this.setState({loaded:true});
              }else{
                if(response.data.Code == 200 && response.data.Status == true){
                   cookieManager.setCookie('email', JSON.stringify(data.email));
                  _this.changeUrl('/resetLink');
                }else{
                  _this.state.emailValid = false;
                  _this.state.formErrors.email = response.data.Message;
                  _this.validateForm();
                }
                _this.setState({loaded:true});
              }
            })
          }
    }

  handleInputOnBlur(e){
        this.validateField(e.target.name, e.target.value);
    }

  handleUserInput(e){
      this.setState({[e.target.name]: e.target.value});
    }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;

    switch(fieldName) {
      case 'email':
        if(value){

          this.state.emailValid = value.match(/^(\s*[\w-+\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}\s*|[0-9]{1,3}\s*)(\]?)$/);
          fieldValidationErrors.email = this.state.emailValid ? '' : CONST.INVALID_EMAIL_ADD;
        }else{
          this.state.emailValid = false;
          fieldValidationErrors.email = this.state.emailValid ? '' : CONST.ENTER_EMAIL;

        }
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    emailValid: emailValid
                  }, this.validateForm);
  }

  validateForm() {

    this.setState({emailValid: this.state.emailValid});
  }
	render(){
    return (
        <div className="forgot-pwd-page-wrapper">
        <SignInImageContainer />

            <section className="forgot-pwd-section pull-right">

        <div className="white-logo-bg"><img onClick={()=>this.changeUrl('/')} src="images/primaryHorizontalRgb@2x.jpg" alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" /></div>

        <div className="form-wrapper">
          <h4>Request Password Reset</h4>
          <p>Please provide your registered email address to aid in the password recovery process.</p>
          <form className="forgot-pwd-form" onSubmit={this._handleClick} >
            <div className={this.state.formErrors.email !== '' ? 'form-group global-error' : 'form-group'}>
              <label htmlFor="email">Email* </label>
              <input type="text" className="form-control email-id" name="email"
                placeholder="Enter your email"
                value={this.state.email}
                onBlur={this.handleInputOnBlur} onChange={this.handleUserInput}  />
              <p><span>{this.state.formErrors.email !== '' ? this.state.formErrors.email : ''}</span></p>
            </div>
            <div className="btns">
              <button type="submit" className="btn btn-blue sign-in-btn">Submit</button>
            </div>
          </form>

          <Link to="/sign-in" className="already-signed">Back to Sign In</Link>
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

export default ForgotPassword;