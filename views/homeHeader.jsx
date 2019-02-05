import React from 'react';
import { Link, browserHistory } from 'react-router';
import Util from '../common/Util.js';
import cookieManager from '../common/cookieManager';

class HomeHeaderContainer extends React.Component {

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
	
   componentDidMount(){
    $(window).scroll(function() {
	    var scroll = $(window).scrollTop();
	    if (scroll >= 50) {
	        $(".navbar-fixed-top").addClass("navbar-blue");
	    } else {
	        $(".navbar-fixed-top").removeClass("navbar-blue");
	    }
	  });
	  $(window).scroll(function(){
      if ($(this).scrollTop() > 100) {
        $("a[href='#top']").fadeIn();
      } else {
        $("a[href='#top']").fadeOut();
      }
    });

    //Click event to scroll to top
    $("a[href='#top']").click(function(){
      $('html, body').animate({scrollTop : 0},800);
      return false;
    });
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
  	    <header className="home-page-header hidden-xs-down">
		      <nav className="navbar navbar-fixed-top">

		        <div className="container-fluid row">
		          <div className="navbar-header m-0 p-0 col-xs-4 col-sm-4">
		            <a className="navbar-brand m-0" href="javascript:void(0);">
		              <img onClick={()=>Util.changeUrl("/")} src="images/logo@2x.png" alt="logo" width="160" />
		            </a>
		          </div>

		          <div className="navbar-right-wraper col-xs-8 pull-right text-right">
                <button type="button" onClick={()=>this.redirectToJobProfile("post-job-details")} className="transy-btn post-job-btn mr-10"> Post a Job </button>
                <button type="button" onClick={()=>this.redirectToJobProfile("find-job")} className="transy-btn find-job-btn mr-10"> Find a Job </button>
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
		      <a href="#top" className="move-to-top"><i className="fa fa-long-arrow-up" aria-hidden="true"></i></a>
		    </header>


        <header className="mobile-header hidden-xs-up home-page-header">
          <nav className="navbar navbar-fixed-top">

            <div className="container-fluid row m-0">

              <div className="navbar-header col-xs-4 m-0 p-0">
                <a className="navbar-brand" href="javascript:void(0);">
                  <img onClick={()=>Util.changeUrl("/")} src="/images/logo@2x.png" alt="logo" width="160" />
                </a>
              </div>

              <div className="navbar-mid-wraper col-xs-7 p-0">
                <button className="transy-btn mobile-find-job-btn" type="button" onClick={()=>this.redirectToJobProfile("find-job")}  > Find a Job </button>
                <button className="transy-btn mobile-post-job-btn" type="button" onClick={()=>this.redirectToJobProfile("post-job-details")} > Post a Job </button>
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
					    <li><Link to="/sign-in"><span className="mr-20"><i className="fa fa-unlock" aria-hidden="true"></i></span>Sign-in</Link></li>
              <li><Link to="/sign-up"><span className="mr-20"><i className="fa fa-unlock-alt" aria-hidden="true"></i></span>Sign-up</Link></li>
					  </ul>
					</div>
        </header>

        </div>
  );
}
}

export default HomeHeaderContainer;
