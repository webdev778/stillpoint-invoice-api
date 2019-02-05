import React from 'react';
import { Link, browserHistory } from 'react-router';
import Util from '../common/Util.js';
import cookieManager from '../common/cookieManager';

class StaticPageHeader extends React.Component {

	constructor (props) {
    super(props);
    this.state = {

    };
    this.redirectToJobProfile = this.redirectToJobProfile.bind(this);
   }

 redirectToJobProfile(from){
  cookieManager.setCookie('fromButton',JSON.stringify({"homeButton":from}));
   Util.changeUrl('/sign-in');
 }



  // js for toggling hamburger -----------------------

  toggleHamburger () {

    // temporary solution. change this logic using react.

    $(".header-wrapper").toggleClass("fade-layer");
      $('#menu').toggleClass('slide-show')
      if(!$( "#main-nav" ).hasClass( "cross-icon" )){
        $( "#main-nav" ).removeClass('open');
        $( "#main-nav" ).addClass('cross-icon');
      }else{
        $( "#main-nav" ).removeClass('cross-icon');
        $( "#main-nav" ).addClass('open');
      }
  }


   render(){
  return (

  		<div className="header-wrapper">
  	    <header className="static-page-header home-page-header hidden-xs-down">
		      <nav className="navbar navbar-fixed-top">

		        <div className="container-fluid row">
		          <div className="navbar-header p-0 m-0 col-xs-4 col-sm-4">
		            <a className="navbar-brand m-0" href="javascript:void(0);">
		              <img onClick={()=>Util.changeUrl("/")} src="images/logo@2x.png" alt="logo" width="160" />
		            </a>
		          </div>

		          <div className="navbar-right-wraper col-xs-8 pull-right text-right">
                <button className="yellow-btn mr-10" type="button" onClick={()=>this.redirectToJobProfile("post-job-details")}> Post a Job </button>
                <button className="yellow-btn mr-10" type="button" onClick={()=>this.redirectToJobProfile("find-job")}> Find a Job </button>
		            <ul className="pull-right">
		              <li className="sign-in-up">
		              	<span><i className="fa fa-unlock-alt" aria-hidden="true"></i></span>
		                <Link to="/sign-in"> Sign In</Link>
		                <span> | </span>
		                <Link to="/sign-up"> Sign Up</Link>
		              </li>
		            </ul>
		          </div>
		        </div>

		      </nav>

		    </header>

		    <header className="mobile-header hidden-xs-up static-page-header">
          <nav className="navbar navbar-fixed-top">

            <div className="container-fluid row m-0">

              <div className="navbar-header col-xs-4 m-0 p-0">
                <a className="navbar-brand" href="javascript:void(0);">
                  <img onClick={()=>Util.changeUrl("/")} src="/images/logo@2x.png" alt="logo" width="160" />
                </a>
              </div>

              <div className="navbar-mid-wraper col-xs-7 p-0">
                <button onClick={()=>this.redirectToJobProfile("find-job")} className="yellow-btn mobile-find-job-btn" type="button"> Find a Job </button>
                <button onClick={()=>this.redirectToJobProfile("post-job-details")} className="yellow-btn mobile-post-job-btn" type="button"> Post a Job </button>
              </div>

              <div className="navbar-right-wraper col-xs-1 pull-right">
                <Link id="main-nav" className="hamburger-icon" onClick={this.toggleHamburger}>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </Link>
              </div>
            </div>

          </nav>

					<div id="menu" className="mobile-menu">
					  <ul className="mobile-ul">
					    <li><Link to="/sign-in"><span className="icon-edit-profile"></span>Sign-in</Link></li>
					    <li><Link to="/sign-up"><span className="icon-change-password"></span>Sign-up</Link></li>
					  </ul>
					</div>
        </header>

        </div>
  );
}
}

export default StaticPageHeader;
