import React from 'react';
import { Link, browserHistory } from 'react-router';


class HomeFooterContainer extends React.Component {

	constructor (props) {
    super(props);
    this.state = {
        collapsible: {
          showAboutUsAddBtn: true,
          showUsefullLinkAddBtn: true
        }
  	};
    this.slideDiv = this.slideDiv.bind(this);
    this.hideAllCollapse = this.hideAllCollapse.bind(this);
  }
    componentDidMount () {
        if($('footer').length !== 0){
          // console.log($('footer'));  
          $('body').css({'padding-bottom':$('footer').outerHeight() + "px"});  // sticky footer
        }
    }

    hideAllCollapse (exceptCollapse) {
        var stateObj = this.state.collapsible;
        $('.footer-inner').slideUp('slow');
        for(var key in stateObj) {
            if(key != exceptCollapse) {
                stateObj[key] = true;
            }
        }
        this.setState({collapsible: stateObj});
    }

    slideDiv (ev, id, stateKey) {
        var _this = this;
        this.hideAllCollapse(stateKey);

        setTimeout(function() {
            var stateObj = _this.state.collapsible;
            var hidden = _this.state.collapsible[stateKey];
            var ele = $('#'+id);
            if(!hidden) {
                ele.slideUp('slow');  // hide
            } else {
                ele.slideDown('slow'); // show
            }

            stateObj[stateKey] = !hidden;

            _this.setState({collapsible: stateObj});
        });

    }



	render(){
        var _this = this;
    return (
    	<div>
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <div className="content-container">
                  <h3 className={'footer-head ' + (this.state.collapsible.showAboutUsAddBtn ? 'add-icon' : 'sub-icon')} onClick={(e) => this.slideDiv(e, 'abtCollapse', 'showAboutUsAddBtn')}>About Us</h3>
                  <div id="abtCollapse" className="footer-inner">
                    <p><Link to="/company-overview" title="Company Overview">Company Overview</Link></p>
                  <p><Link to="/privacy-policy" title="Privacy Policy">Privacy Policy</Link></p>
                  <p><Link to="/terms-of-service" title="Terms of Service">Terms of Service</Link></p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="content-container">
                  <h3 className={'footer-head ' + (this.state.collapsible.showUsefullLinkAddBtn ? 'add-icon' : 'sub-icon')} onClick={(e) => this.slideDiv(e, 'usefullCollapse', 'showUsefullLinkAddBtn')}>Useful Links</h3>
                  <div id="usefullCollapse" className="footer-inner">
                    <p><Link to="/frequently-asked-questions" title="FAQs">FAQs</Link></p>
                    <p><Link to="/support-center" title="Support and Suggestions">Support and Suggestions</Link></p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <h3>Follow Us</h3>
                <ul className="social-icons">
                  <li>
                    <a href="http://www.facebook.com/Legably" title="Facebook">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/Legably" title="Twitter">
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/company/legably" title="LinkedIn">
                      <i className="fa fa-linkedin"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <p className="copyright">&copy; 2017 Legably Inc.</p>
          </div>
        </footer>
      </div>

    );
  }
}

export default HomeFooterContainer;
