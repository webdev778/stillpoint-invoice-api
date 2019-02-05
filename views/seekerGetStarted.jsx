import React from 'react';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import ProfileBullet from './profileBullets.jsx';
import TopContent from './topContent.jsx';
import Util from '../common/Util.js';

class SeekerThankYou extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      seekeractive : 'tab-btn-blue',
      posteractive : 'tab-btn-white'
    }
  }

render(){
    return (
      <div>
        <Commonheader />
        <div className="get-started-wrapper content-wrapper container">
          <TopContent url={'/attorney-profile-get-started'} thisObj={this} active={this.state.seekeractive} inactive={this.state.posteractive}  showP ={Util.showpop} headTitle="Get Started!" content=""/>
	        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={()=>Util.changeUrl("/attorney-profile-job-type")}></span> Get Started!</div>
	        <ProfileBullet currentProfilePage="5" completeStatus="4" profileComplete="true"/>
   	     <div className="get-started-form form">
			      <div className="get-started-card card">
            	<h5>Thank you for completing your Legably profile!</h5>
              <p>Our team is currently working hard to put the finishing touches on the Legably platform and expect that you’ll be able to take advantage of exciting opportunities across the U.S. via our system beginning in December of 2017.</p>
              <p>We’ll keep you up-to-date on our progress and you can trust that you’ll be among the first to have access to Legably.</p>
              <p>We look forward to helping you find the perfect opportunity!</p>
              <p>Sincerely,</p>
              <img src="images/dan-reilly.png" />
              <div className="ceo">
                <strong>Daniel P. Reilly</strong><br />
                CEO<br />
                Legably Inc.
              </div>
          	</div>

            <div className="nxt-prev-btns">
              <button type="click" onClick={()=>Util.changeUrl("/attorney-profile-job-type")} className="previouse-btn btn pull-left mb-10">Previous</button >
              <span className="clear-fix"></span>
            </div>
            
          </div>
        </div>
      	<Commonfooter />
      </div>
    );
  }
}


export default SeekerThankYou;