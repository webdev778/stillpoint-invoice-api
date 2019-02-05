import React from 'react';
import SignInImageContainer from './SignInImageContainer.jsx';
import { Link, browserHistory } from 'react-router';
import Commonfooter from './footer.jsx';

class ResetLinkError extends React.Component{
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

		        <div class="white-logo-bg"><img onClick={()=>this.changeUrl("/")} src="/images/primaryHorizontalRgb@2x.jpg" alt="leably-white-logo" className="img-responsive mobile-on-logo" width="120" height="31" /></div>

		        <div className="form-wrapper">
		          <img src="/images/reset-link.png" alt="reset-link" className="img-responsive" />
		          <h5>Invalid Link or Link has been expired</h5>
		          <button type="submit" onClick={()=>this.changeUrl("/sign-in")} className="btn reset-link-btn">Continue to Sign In</button>
		        </div>
		      </section>
		      <Commonfooter />
	      </div>

	    );
	  }

}

export default ResetLinkError;
