import React from 'react';
import { browserHistory } from 'react-router';
import Util from '../common/Util.js';

class EnsureNonLoggedInContainer extends React.Component {
	constructor(props) {
      super(props);
      this.state = {
       token: ''
      };
      this.validateToken = this.validateToken.bind(this);
  }

  componentDidMount() {
  	this.setState({token : Util.getToken()}, function(){
      this.validateToken();
    });
  }

  validateToken(){
  	if(Util.getToken()){
  		Util.redirectionHandle();
  	}
  }

  render() {
    if (!this.state.token) {
      return this.props.children
    } else {
      return null
    }
  }
}


export default EnsureNonLoggedInContainer;
