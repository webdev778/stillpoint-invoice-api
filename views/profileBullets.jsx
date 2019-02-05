import React from 'react';
import { Link, browserHistory } from 'react-router';


class ProfileBullet extends React.Component {
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
              <li className={(this.props.currentProfilePage == 1) ? "active fill" : 'fill'}>
                <Link to="/attorney-profile-basic-info">
                  <span className="round-tabs one"></span> 
                </Link>
                <span onClick={()=>this.goTo('/attorney-profile-basic-info')}>Basic Info + Education</span><span></span>
              </li>
              <li className={`${this.props.currentProfilePage >= 2 || this.props.profileComplete == true || this.state.profileComplete == true ? "fill" : ''} ${this.props.currentProfilePage == 2 ? "active" : ''} ${this.state.completeStatus >= 1 || this.props.completeStatus >= 1 ? '' : 'disabled-element'}`}>
                <Link to="/attorney-profile-experience">
                  <span className="round-tabs two"></span> 
                </Link>
                <span onClick={()=>this.goTo('/attorney-profile-experience')}>Experience</span><span></span>
              </li>
              <li className={`${this.props.currentProfilePage >= 3 || this.props.profileComplete == true || this.state.profileComplete == true ? "fill" : ''} ${this.props.currentProfilePage == 3 ? "active" : ''} ${this.state.completeStatus >= 2 || this.props.completeStatus >= 2? '' : 'disabled-element'}`}>
                <Link to="/attorney-profile-headline">
                  <span className="round-tabs three"></span>
                </Link>
                <span onClick={()=>this.goTo('/attorney-profile-headline')}>Headline + Additional Info</span><span></span>
              </li>
              <li className={`${this.props.currentProfilePage >= 4 || this.props.profileComplete == true || this.state.profileComplete == true ? "fill" : ''} ${this.props.currentProfilePage == 4 ? "active" : ''} ${this.state.completeStatus >= 3 || this.props.completeStatus >= 3 ? '' : 'disabled-element'}`}>
                <Link to="/attorney-profile-job-type">
                  <span className="round-tabs four"></span> 
                </Link>
                <span onClick={()=>this.goTo('/attorney-profile-job-type')}>Job Type</span><span></span>
              </li>
              <li className={`${this.props.currentProfilePage >= 5 || this.props.profileComplete == true || this.state.profileComplete == true ? "fill" : ''} ${this.props.currentProfilePage == 5 ? "active" : ''} ${this.props.completeStatus >= 4 ? '' : 'disabled-element'}`}>
                <Link to='/attorney-profile-get-started'>
                  <span className="round-tabs five"></span>
                </Link>
                <span onClick={()=>this.goTo('/attorney-profile-get-started')}>Get Started!</span>
                <span></span>
              </li>
            </ul>
          </div>
        </section>
        
    );
  }
}

export default ProfileBullet;