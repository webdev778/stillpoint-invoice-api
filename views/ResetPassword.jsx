import React from 'react';
import ResetLinkSuccess from './ResetLinkSuccess.jsx';
import ResetLinkError from './ResetLinkError.jsx';
import { Link } from 'react-router';
import {ApiCall} from '../server/config/util.js';

class ResetPassword extends React.Component{
	constructor(props) {
        super(props);
        this.state = {
  	      validLink : true,
          loaded:true
        }
    }

	  componentDidMount() {
    	var _this = this;
      this.setState({loaded:false});
    	ApiCall('post','/checkResetLink/'+this.props.params.secretId ,{},'', function(err, response){
        if(err){
          console.log("error : ",err)
          _this.setState({loaded:true});
        }else{
          console.log(response);
           if(response.data.Code == 200 && response.data.Status == true){
	            _this.setState({validLink : true});
              
	          }else{
	            _this.setState({validLink : false});
	          }
            _this.setState({loaded:true});
        }
      })
	  }

    render(){
	      return (
	      	<div>
         
	      		{this.state.validLink ? <ResetLinkSuccess secretId={this.props.params.secretId}/> : <ResetLinkError />}
          <div className={this.state.loaded ? 'fade-layer d-none' : 'fade-layer'}>
           <div className="loader"></div>
          </div>
      		</div>
      	)
	    
	  }

}

export default ResetPassword;
