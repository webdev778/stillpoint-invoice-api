import React from 'react';
import SignInImageContainer from './SignInImageContainer.jsx';
import { Link, browserHistory} from 'react-router';
import cookieManager from '../common/cookieManager';
import Commonfooter from './footer.jsx';

class ResetLink extends React.Component{
	constructor(props) {
        super(props);
        this.state = {
        	email : 'example@example.com'
        }
        this.changeUrl = this.changeUrl.bind(this);

    }

  changeUrl(url){
		browserHistory.push(url);
	}


    componentDidMount() {
	    this.setState({email :JSON.parse(cookieManager.getCookie('email'))});
	  }

    render(){
	    return (
	    	<div className="reset-link-page-wrapper">
	    		<SignInImageContainer />
		       <section className="reset-link-section pull-right">

		        <div className="white-logo-bg"><img onClick={()=>this.changeUrl("/")} src="images/primaryHorizontalRgb@2x.jpg" alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" /></div>

		        <div className="form-wrapper">
		          <img src="images/reset-link.png" alt="reset-link" className="img-responsive" />
		          <h5>An email has been sent to {this.state.email}. Please click on the link provided in the mail to reset your password.</h5>
		          <p>In case you do not receive your password reset email shortly, please check spam folder also. </p>
		          <button type="submit" onClick={()=>this.changeUrl("/sign-in")} className="btn reset-link-btn">Continue to Sign In</button>
		        </div>
		      </section>
		      <Commonfooter />
	      </div>

	    );
	  }
}

export default ResetLink;