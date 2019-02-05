import React from 'react';
import { Link, browserHistory } from 'react-router';
import Util from '../common/Util.js';


export default class TopContent extends React.Component {
	constructor (props) {
    super(props);
    this.state={
      submitted:'',
      _url:''
    }
  }
  componentWillReceiveProps(nextProps){ 
    this.setState({submitted:nextProps.submitted});
  }

  componentDidMount(){
    if(this.props.url){
      this.setState({_url:this.props.url})
    }
  }
  
	render(){
    return (
      <div className="common-top-content">

      <h3>{this.props.headTitle}</h3>
      <p>{this.props.content}</p>
      <div className="tabs">
      <button name="seeker" className = {'btn '+ this.props.active} onClick={(e)=>this.props.showP(e,this.props.thisObj,this.state.submitted,this.state._url)}>I want to find a job</button>
      <button name="poster" className = {'btn '+ this.props.inactive} onClick={(e)=>this.props.showP(e,this.props.thisObj,this.state.submitted,this.state._url)}>I want to post a job</button>
      </div>
      </div>
        
    );
  }
}
