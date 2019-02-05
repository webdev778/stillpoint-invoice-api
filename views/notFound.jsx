import React from 'react';
import { Link, browserHistory } from 'react-router';
import StaticPageHeader from './staticPageHeader.jsx';
import HomeFooterContainer from './homeFooter.jsx';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';



class NotFound extends React.Component {
	constructor (props) {
    super(props);
    this.goToHomePage = this.goToHomePage.bind(this);

  }

  goToHomePage(){
    browserHistory.push("/");
  }


 render(){
    return (
    	<div className="error-page">
          <div className="container">
            <div className="row text-center">
    	        <h1 className="error">404</h1>
              <h4>Oops! page not found.</h4>
              <p>The page you're looking for doesn't exist or has been moved.</p>
              <button className="btn" onClick={this.goToHomePage}>Back To Homepage</button>
            </div>
          </div>
      </div>


    );
  }
}

export default NotFound;
