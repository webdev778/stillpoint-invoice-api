import React from 'react';
import { Link, browserHistory } from 'react-router';


class Commonfooter extends React.Component {
     componentDidMount () {
        if($('footer').length !== 0){
          // console.log($('footer'));  
          $('body').css({'padding-bottom':$('footer').outerHeight() + "px"});  // sticky footer
        }
    }

  render(){
    return (


      <footer className="basic-info-footer">
        <div className="footer-container row">
          <div className="footer-left col-sm-3">
            <span>  &copy; 2017 Legably Inc.</span>
          </div>
          <div className="footer-right col-sm-9">
            <ul className="list-inline">
              <li className="list-inline-item"><Link to="/frequently-asked-questions">FAQ's</Link></li>
              <li className="list-inline-item"><Link to="/company-overview">About Us</Link></li>
              <li className="list-inline-item"><Link to="/support-center">Support and Suggestions</Link></li>
              <li className="list-inline-item"><Link to="/terms-of-service">Terms of Service</Link></li>
              <li className="list-inline-item"><Link to="/privacy-policy">Privacy Policy</Link></li>
              {/*<li className="list-inline-item"><a href="">Sitemap</a></li>*/}
            </ul>
          </div>
          <div className="clear-fix"></div>
        </div>
      </footer>


    );
  }
}

export default Commonfooter;