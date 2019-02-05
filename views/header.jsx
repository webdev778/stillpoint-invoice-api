import React from 'react';
import { Link, browserHistory } from 'react-router';
import {ApiCall} from '../server/config/util.js';
import Util from '../common/Util.js';
import cookieManager from '../common/cookieManager';

export default class Commonheader extends React.Component {
  constructor(props) {
          super(props);
          this.state = {
           first_name : '',
           last_name : '',
           token: '',
           photo : ''
          };
          this._handleClick = this._handleClick.bind(this);
          this.toggleHamburger = this.toggleHamburger.bind(this);
          this.currentLoc = this.currentLoc.bind(this);
          this.redirectToJobProfile = this.redirectToJobProfile.bind(this);
          this.goToEditProfile = this.goToEditProfile.bind(this);
          this.profileImgError = this.profileImgError.bind(this);
          this.isAdmin = this.isAdmin.bind(this);
  }

  goToEditProfile(){
    cookieManager.setCookie('seekeractive','tab-btn-blue');
    cookieManager.setCookie('posteractive','tab-btn-white');
    browserHistory.push('/attorney-profile-basic-info');
  }


  profileImgError(evt){
    evt.target.onerror = "";
    evt.target.src = "/images/image_placeholder.png";
    return true;
  }

 _handleClick() {
   ApiCall('post','/logout',{},this.state.token , function(err, response){
      if(err){
        console.log("error : ",err)
      }else{
        if(response.data.Code == 200 && response.data.Status == true){
          Util.rememberMeFunc();
        }else{
          console.log(err);
        }
      }
    })
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = "/js/propeller.min.js";
    script.async = true;
    document.body.appendChild(script);
    window.scrollTo(0,0);

    $('body').css({'padding-bottom':$('footer').outerHeight() + "px"});

    var userData = Util.getUserData();
    if(userData){
      this.setState({first_name : userData.first_name, last_name : userData.last_name, token : userData.token, photo : userData.s3BucketUrl + userData.userImage});
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.userImage != undefined){
      this.setState({
        photo : nextProps.userImage
      });
    }
    if(nextProps.firstName != undefined && nextProps.lastName != undefined){
      this.setState({
        first_name : nextProps.firstName,
        last_name  : nextProps.lastName
      });
    }
  }

  isAdmin() {
    return (Util.getUserData()['role'] === 'admin');
  }

  currentLoc(){
    return (window.location.href.includes('attorney') || window.location.href.includes('post-job') || this.isAdmin());
  }

 redirectToJobProfile(from){
  cookieManager.setCookie('fromButton',JSON.stringify({"homeButton":from}));
  Util.changeUrl('/sign-in');
 }

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
        <header className="desktop-header hidden-xs-down">

          <nav className="navbar navbar-fixed-top">


            <div className="container-fluid row m-0">

              <div className="navbar-header col-xs-4 m-0 p-0">
                <a className="navbar-brand m-0" href="javascript:void(0);">
                  <img onClick={()=>Util.redirectionHandle()} src="/images/logo@2x.png" alt="logo" width="160" />
                </a>
              </div>

              <div className="navbar-right-wraper col-xs-8 pull-right text-right">
                <div className={this.currentLoc() ? "d-none" : "d-inline-block"}>
                  <button className="yellow-btn mr-10" type="button" onClick={()=>this.redirectToJobProfile("post-job-details")} > Post a Job </button>
                  <button className="yellow-btn mr-10" type="button" onClick={()=>this.redirectToJobProfile("find-job")} > Find a Job </button>
                </div>
                <ul className="pull-right">
                  <li className="p-0 dropdown pmd-dropdown">
                    <span className="profile-pic"><img src={this.state.photo ? this.state.photo : "/images/default-profile-pic.png"} onError={this.profileImgError} /></span>
                    <Link href="javascript:void(0);" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                      <span className="user-name">{this.state.first_name} {this.state.last_name}</span>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-right">
                      <li className={this.currentLoc() ? 'd-none': 'd-block'}><Link onClick={this.goToEditProfile}><span className="icon-edit-profile-mobile"></span>Edit Profile</Link></li>
                      {this.isAdmin() ? null :  (<li><Link to="/changePassword"><span className="icon-change-password-mobile"></span>Change Password</Link></li>)}
                      <li><Link onClick={this._handleClick}><span className="icon-sign-out-mobile"></span>Sign Out</Link></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

          </nav>
        </header>

        <header className="mobile-header hidden-xs-up">
          <nav className="navbar navbar-fixed-top">

            <div className="container-fluid row m-0">

              <div className="navbar-header col-xs-4 m-0 p-0">
                <a className="navbar-brand" href="javascript:void(0);">
                  <img onClick={()=>Util.redirectionHandle()} src="/images/logo@2x.png" alt="logo" width="160" />
                </a>
              </div>

              <div className={this.currentLoc() ? "d-none navbar-mid-wraper col-xs-7 p-0" : "navbar-mid-wraper col-xs-7 p-0"}>
                <button className="yellow-btn mr-10 mobile-find-job-btn" type="button" onClick={()=>this.redirectToJobProfile("find-job")}  > Find a Job </button>
                <button className="yellow-btn mobile-post-job-btn" type="button" onClick={()=>this.redirectToJobProfile("post-job-details")} > Post a Job </button>
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
            <img src={this.state.photo ? this.state.photo : "/images/image_placeholder.png"} onError={this.profileImgError} alt="user pic" />
            <ul className="mobile-ul">
              <li className={this.currentLoc() ? 'd-none': 'd-block'}><Link onClick={this.goToEditProfile}><span className="icon-edit-profile"></span>Edit Profile</Link></li>
              {this.isAdmin() ? null : (<li><Link to="/changePassword"><span className="icon-change-password"></span>Change Password</Link></li>)}

              <li><Link onClick={this._handleClick}><span className="icon-sign-out"></span>Sign Out</Link></li>
            </ul>
          </div>
        </header>
      <script type="text/javascript" src="/js/jquery.min.js" />
      <script type="text/javascript" src="/js/propeller.min.js" />
      <script type="text/javascript" src="js/jquery.sumoselect.min.js"></script>
    </div>
    );
  }
}
