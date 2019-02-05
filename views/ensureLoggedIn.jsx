import React from 'react';
import Util from '../common/Util.js';

class EnsureLoggedInContainer extends React.Component {
	constructor(props) {
      super(props);
      this.state = {
       token: ''
      };
      this.validateToken = this.validateToken.bind(this);
  }

  componentDidMount() {
  	this.setState({token : Util.getToken()},function(){
		  this.validateToken();
    });
  }

  validateToken(){
    if (this.state.token) {
      var role = Util.getUserData()['role'];
      var isAdmin = this.props.location.pathname.includes('admin');
      if (role === 'admin' && !isAdmin) {
        Util.changeUrl("/admin-dashboard");
      } else if (role === 'user' && isAdmin) {
        utils.redirectionHandle();
      }
    } else {
      Util.changeUrl("/sign-in");
    }
  }

  render() {
    if (this.state.token) {
      return this.props.children
    } else {
      return null
    }
  }
}


export default EnsureLoggedInContainer;
