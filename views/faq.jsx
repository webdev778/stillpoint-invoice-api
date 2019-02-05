import React from 'react';
import { Link, browserHistory } from 'react-router';
import StaticPageHeader from './staticPageHeader.jsx';
import HomeFooterContainer from './homeFooter.jsx';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import Util from '../common/Util.js';

class FaqContainer extends React.Component {
		constructor (props) {
    super(props);
    this.state = {
    	token : ''
  	};

  }

  componentDidMount() {
    window.scrollTo(0,0);
  	this.setState({token : Util.getToken()});
  }


	render(){
    return (
    	<div className="bg-white">
    			{this.state.token ? <Commonheader /> : <StaticPageHeader />}
       	<div className="static-heading">
	        <h1>FAQ</h1>
	      </div>

	      <div className="content-wrapper container">

        <div className="faq-section">
          <h1>Frequently Asked Questions</h1>
          <div className="faq-panel">
            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
              <div className="panel panel-default">
                <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  <div className="panel-heading" role="tab" id="headingOne">
                    <h4 className="panel-title">
                        What is Legably?
                    </h4>
                  </div>
                </a>
                <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                  <div className="panel-body">
                    Legably is an online freelance staffing platform that connects vetted and licensed attorneys who are looking for contract engagements with other attorneys and firms in need of staffing support.
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  <div className="panel-heading" role="tab" id="headingTwo">
                    <h4 className="panel-title">
                        How does Legably work?
                    </h4>
                  </div>
                </a>
                <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">
                  <div className="panel-body">
                    Attorneys create profiles on Legably and provide their professional and firm information. They then bid on work being posted by other attorneys who are looking for help. When attorneys are hired, they agree to the scope of work, the timeline it will be completed in, and the total amount that the lawyer performing the work will charge.
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  <div className="panel-heading" role="tab" id="headingThree">
                    <h4 className="panel-title">
                      Who can use Legably?
                    </h4>
                  </div>
                </a>
                <div id="collapseThree" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">
                  <div className="panel-body">
                    Any attorney, who is licensed and in good standing in their licensing jurisdiction, may use Legably. At this time, Legably is not open to non-attorney users.
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  <div className="panel-heading" role="tab" id="headingFour">
                    <h4 className="panel-title">
                      How do I post work to be completed?
                    </h4>
                  </div>
                </a>
                <div id="collapseFour" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">
                  <div className="panel-body">
                    Any attorney with a profile can also post a job for completion. You do not have to create a separate account. Simply click the "Post a Job" link at the top of the page once you have logged into Legably.
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                  <div className="panel-heading" role="tab" id="headingFive">
                    <h4 className="panel-title">
                        What does Legably cost?
                    </h4>
                  </div>
                </a>
                <div id="collapseFive" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">
                  <div className="panel-body">
                    Legably is free for attorneys to create profiles, search for work, and post jobs to
                    be completed. Legably only takes a small percentage fee of the total budgeted work
                    being performed. This only happens once both attorneys have agreed to the total
                    budget and the hiring attorney has been billed for the work.
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                  <div className="panel-heading" role="tab" id="headingSix">
                    <h4 className="panel-title">
                        Is Legably a temp agency?
                    </h4>
                  </div>
                </a>
                <div id="collapseSix" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSix">
                  <div className="panel-body">
                    Not really. While Legably matches attorneys looking for work with other
                    attorneys who need help, users are never under contract and are free
                    to work on other engagements that they may agree to on or off of the Legably platform.
                    Unlike temp agencies, Legably does not charge exorbitant mark ups or fees.
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                  <div className="panel-heading" role="tab" id="headingSeven">
                    <h4 className="panel-title">
                      Is Legably a law firm or legal client referral service?
                    </h4>
                  </div>
                </a>
                <div id="collapseSeven" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSeven">
                  <div className="panel-body">
                    No. Legably does not provide any legal advice to any party, for any reason.
                    Legably does not connect clients to attorneys, and is in no way involved in any
                    attorney-client relationships. Legably profiles may only be created by licensed
                    attorneys in good standing with their licensing jurisdictions.
                  </div>
                </div>
              </div>
              <div className="panel panel-default">
                <a className="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                  <div className="panel-heading" role="tab" id="headingEight">
                    <h4 className="panel-title">
                        Who can I ask if I have any questions?
                    </h4>
                  </div>
                </a>
                <div id="collapseEight" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingEight">
                  <div className="panel-body">
                    Feel free to contact our customer support team at <a className="contact-link" href='mailto:support@legably.com'>info@legably.com</a> at any
                    time, day or night, to have any of your questions answered. We will always respond
                    to user comments and concerns (if any) - so send them along as well!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

	     {this.state.token ? <Commonfooter /> : <HomeFooterContainer />}
      </div>


    );
  }
}

export default FaqContainer;
