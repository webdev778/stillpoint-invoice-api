import React from 'react';
import { Link, browserHistory } from 'react-router';


class ProfileBulletPoster extends React.Component {
	constructor (props) {
    super(props);
    this.state = {

  	};
    this.goTo = this.goTo.bind(this);
   
  }


   componentWillReceiveProps(nextProps) {
    this.setState({
      completeStatus: nextProps.completeStatus,
       profileComplete : nextProps.profileComplete
    });
  }
  goTo(val){
  browserHistory.push(val);
  }

	render(){
    return (
      <section className="steps-widget">
          <div className="board-inner">
            <ul className="nav nav-tabs" id="myTab">
              <div className="liner"></div>
              <li className={this.props.currentProfilePage == 1 ? "active fill" : 'fill'}>
                <Link to="/post-job-basic-information">
                  <span className="round-tabs one"></span> 
                </Link>
                <span onClick={()=>this.goTo('/post-job-basic-information')}>Basic Information</span><span></span>
              </li>
              <li className='v-hidden'>
                <Link>
                  <span className="round-tabs two"></span> 
                </Link>
                <span>Post Job</span><span></span>
              </li>
              <li className={`${this.props.currentProfilePage >= 2 || this.props.profileComplete == true || this.state.profileComplete == true ? "fill" : ''} ${this.props.currentProfilePage == 2 ? "active" : ''} ${this.state.completeStatus >= 1 || this.props.completeStatus >= 1 ? '' : 'disabled-element'}`}>
                <Link to="/post-job-details">
                  <span className="round-tabs three"></span> 
                </Link>
                <span onClick={()=>this.goTo('/post-job-details')}>Post Job</span><span></span>
              </li>
              <li className='v-hidden'>
                <Link to="/attorney-profile-experience">
                  <span className="round-tabs two"></span> 
                </Link>
                <span>Post Job</span><span></span>
              </li>
              <li className={`${this.props.currentProfilePage >= 3 || this.props.profileComplete == true || this.state.profileComplete == true ? "fill" : ''} ${this.props.currentProfilePage == 3 ? "active" : ''} ${this.props.completeStatus >= 2 ? '' : 'disabled-element'}`}>
                <Link to="/post-job-thank-you">
                  <span className="round-tabs five"></span>
                </Link>
                <span onClick={()=>this.goTo('/post-job-thank-you')}>Thank You!</span><span></span>
              </li>
             
            </ul>
          </div>
        </section>
        
    );
  }
}

export default ProfileBulletPoster;