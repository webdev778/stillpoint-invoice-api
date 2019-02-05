import React from 'react';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import ProfileBullet from './profileBullets.jsx';
import TopContent from './topContent.jsx';
import Util from '../common/Util.js';
import ProfileBulletPoster from './profileBulletsPoster.jsx';
import cookieManager from '../common/cookieManager';

class PosterThankYou extends React.Component {
   constructor (props) {
    super(props);
    this.state = {
    seekeractive : 'tab-btn-white',
    posteractive : 'tab-btn-blue',
    }
  }

  componentDidMount() {
      var _this = this;
        /*this.setState({seekeractive : 'tab-btn-blue'});
        this.setState({posteractive : 'tab-btn-white'});*/
    }

render(){
    return (
      <div>
        <Commonheader />
        <div className="get-started-wrapper content-wrapper container">
      {/*  <TopContent url={'/attorney-profile-experience'} thisObj={this} active={this.state.seekeractive} inactive={this.state.posteractive} submitted={this.state.submitted}  showP = {Util.showpop} headTitle="Job Type" content="Finally, please provide details regarding the type of opportunities you are interested in exploring on Legably."/>
       */} 
        <TopContent url={'/post-job-thank-you'} thisObj={this} active={this.state.seekeractive} inactive={this.state.posteractive} showP = {Util.showpop} headTitle="Thank You!" content=""/>
	        <div className="visible-xs mobile-page-heading"><span className="previous" onClick={()=>Util.changeUrl("/post-job-details")}></span> Thank You!</div>
	                 
         <ProfileBulletPoster currentProfilePage="3" completeStatus="2" profileComplete = "true"/>
                  
   	     <div className="get-started-form form">
			      <div className="get-started-card card">
            	<h5>Thank you for posting your job on Legably!</h5>
              <p>Our team is currently working hard to put the finishing touches on the Legably platform and expect that you’ll begin hearing from highly-qualified candidates beginning in December of 2017.</p>
              <p>We’ll keep you up-to-date on our progress and you can trust that you’ll be among the first to have access to Legably.</p>
              <p>We look forward to helping you find the perfect attorney!</p>
              <p>Sincerely,</p>
              <img src="images/dan-reilly.png" />
              <div className="ceo">
                <strong>Daniel P. Reilly</strong><br />
                CEO<br />
                Legably Inc.
              </div>
          	</div>
          </div>

          <div className="nxt-prev-btns">
            <button type="click" onClick={()=>Util.changeUrl("/post-job-details")} className="previouse-btn btn pull-left mb-10">Previous</button >
            <span className="clear-fix"></span>
          </div>

        </div>
      	<Commonfooter />
      </div>
    );
  }
}


export default PosterThankYou;