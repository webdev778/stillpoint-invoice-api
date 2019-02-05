import React from 'react';
import { browserHistory } from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import Util from '../common/Util.js';
import cookieManager from '../common/cookieManager';
export default class ThankYou extends React.Component {

  constructor(props) {
          super(props);
          this.state = {
          };
          this.changeUrl = this.changeUrl.bind(this);
  }

  changeUrl(){
    if(Util.getValFromCookie('fromButton')){
      Util.redirectionHandle();
    }else{
     
      browserHistory.push("/attorney-profile-basic-info");
    }
  }
  componentDidMount() {
    this.setState({seekeractive : 'tab-btn-blue'});
    this.setState({posteractive : 'tab-btn-white'});
  }
 
  render(){
    return (
    	<div>
        <Commonheader/>
        <div className="thank-you-container content-wrapper container">

          <div className="thank-you-form form">

            <div className="thank-you-card card">
              <img src="images/thank-u.png" alt="Thank You" className="img-responsive" />
              <h4>Thanks!</h4>
              <p>You have successfully signed-up to Legably.  Please click below to get started!</p>
              <button type="submit" className="btn" onClick={()=>this.changeUrl()}>Get Started</button>

            </div>

          </div>

        </div>
        <Commonfooter/>
      </div>

    );
  }
}
