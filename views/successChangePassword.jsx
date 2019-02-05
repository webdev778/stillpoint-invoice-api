import React from 'react';
import SignInImageContainer from './SignInImageContainer.jsx';
import { browserHistory } from 'react-router';
import Commonfooter from './footer.jsx';

class SuccessChangePassword extends React.Component{
	constructor(props) {
        super(props);
        this.changeUrl = this.changeUrl.bind(this);

    }

  changeUrl(url){
		browserHistory.push(url);
	}

    render(){
	    return (
	    	<div className="reset-link-page-wrapper">
	    		<SignInImageContainer />
	    		<section className="reset-link-section pull-right">

		        <img onClick={()=>this.changeUrl("/")} src="/images/primaryHorizontalRgb@2x.jpg" alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" />

		        <div className="form-wrapper">
		           <img src="images/thank-u.png" alt="Thank You" className="img-responsive" />
	            <h5>Thanks! You have successfully reset your password</h5>
	            <button type="submit" className="btn reset-link-btn" onClick={()=>this.changeUrl("/sign-in")}>Sign In</button>
		        </div>
		      </section>
		      <Commonfooter />
        </div>


	    );
	  }

}

export default SuccessChangePassword;
