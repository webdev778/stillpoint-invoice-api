import React from 'react';
import { Link } from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';

export default class Baradmissioncard  extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
        
        <div>

          <h4>Bar Admission</h4>

          <div className="row">
            <div className="col-sm-6">
            
              <div className="form-group">       
                <label className="control-label">State</label>
                <select className="select-simple form-control pmd-select2" name={`stateBarAd${this.props['index']}`} value={this.state.formVal.bar_admission[this.props['index']].bar_state_id}>
                  <option>Select State</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
            </div>
            <div className="col-sm-6">
            
              <div className="form-group">
                <label className="control-label">bar registration number*</label>
                <input type="number" id="bar-reg-num" name={`barReg${this.props['index']}`} className="form-control" placeholder="Bar Registration Number" value={this.state.formVal.bar_admission[this.props['index']].bar_registration_number}/>
               
              </div>
            </div>
          
          </div>

        </div>

        )
  }

}