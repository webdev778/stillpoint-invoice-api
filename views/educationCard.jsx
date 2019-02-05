import React from 'react';
import { Link } from 'react-router';

export default class Educationcard extends React.Component {
  constructor(props){
  	super(props)
    this.state={
      stateData:{},
      thisObj:{}
    }

    
  }
  componentWillMount() {
     console.log(this.props.stateData)
     const stateData = this.props.stateData;
     const thisObj = this.props.thisObj;
    // this.setState({stateData,thisObj});
     this.setState({stateData,thisObj},function(){
      console.log(this.state.stateData)
     })
     
      
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextState.open == true && this.state.open == false) {
      console.log(nextProps.stateData+"hhhhhhh")
            const stateData = nextProps.stateData;
            const thisObj = nextProps.thisObj;
           // this.setState({stateData,thisObj});
            this.setState({stateData,thisObj},function(){
             console.log(this.state.stateData)
            })
    }
  }



  render(){
  	return (
  		<div>
  		  <h4>Education</h4>

  		  <div className="row">
  		    <div className="col-sm-6">
  		    
  		      <div className="form-group">       
  		        <label className="control-label">School*</label>
  		        <input type="text" id="school" name="school" onChange={(e)=>this.props.thisObj.handleUserEduInput(this.props['index'],e)} value={this.state.stateData.education[this.props['index']].school} className="form-control" placeholder="School" />
  		      
  		      </div>
  		    </div>
  		    <div className="col-sm-6">
  		     
  		      <div className="form-group">       
  		        <label className="control-label">Degree*</label>
  		        <select className="select-simple" name="degree_id" onChange={this.props.thisObj.handleUserEduInput} value={this.state.stateData.education[this.props['index']].degree_id}>
  		          <option>Degree</option>
  		          <option>2</option>
  		          <option>3</option>
  		          <option>4</option>
  		          <option>5</option>
  		        </select> 		        
  		      </div>
  		    </div>
  		  </div>
  		  <div className="row">
  		    <div className="col-sm-6">
  		     
  		      <div className="form-group">       
  		        <label className="control-label">Year Graduated*</label>
  		        <input type="text" id="ygraduated" name="year" onChange={this.props.thisObj.handleUserEduInput} value={this.state.stateData.education[this.props['index']].year} className="form-control" placeholder="Year Graduated" />
  		       
  		      </div>
  		    </div>
  		    <div className="col-sm-6">
  		     
  		      <div className="form-group">
  		        <label className="control-label">Additional Information</label>
  		        <input type="text" id="add-info" name="education_additional_information" onChange={this.props.thisObj.handleUserEduInput} value={this.state.stateData.education[this.props['index']].education_additional_information} className="form-control" placeholder="Additional Information" />
  		      </div>
  		    </div>
  		    
  		  </div>

  		</div>


     
  		)
  }

}

