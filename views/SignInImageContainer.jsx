import React from 'react';
import { Link, browserHistory } from 'react-router';

class SignInImageContainer extends React.Component {

	constructor(props) {
	  super(props);
	  this.state = {
	  };
	  this.goToHomePage = this.goToHomePage.bind(this);
  
  }

	goToHomePage(){
    browserHistory.push("/");
  }

	render(){
	  return (
	  	<div>
			<section className="sign-in-banner pull-left forgot-pwd-banner reset-link-banner">
		      <div>
		        <img onClick={this.goToHomePage} src="/images/logo@2x.png" alt="leably-white-logo" className="img-responsive logo" width="180" height="47" />
		        <h3>Find the best legal job</h3>
		        <h3>Hire the best attorney</h3>
		        <p>Legably is the modern online legal staffing platform that connects attorneys seeking work with other attorneys and firms in need of their services.</p>
		      </div>
		    </section>
	    </div>
	  );
	}
}

export default SignInImageContainer;