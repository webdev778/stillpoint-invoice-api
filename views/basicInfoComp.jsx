import React from 'react';
import { Link,browserHistory} from 'react-router';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import EducationCard from './educationCard.jsx';
import Baradmissioncard from './baradmissionCard.jsx';
import {ApiCall} from '../server/config/util.js';
import ProfileBullet from './profileBullets.jsx';
import MaskedInput from './maskPhoneCompo.jsx';
import Select from 'react-select';
import topContent from './topContent.jsx';
import Util from '../common/Util.js';
import CONST from '../common/Const.js';
import TopContent from './topContent.jsx';
import Popup from './popup.jsx';
///import ProExperience from '/sign-up-experience.jsx';
export default class ProBasicInfo extends React.Component {
	constructor(props) {
	        super(props);
	        this.state = {         
         
          }

	    }


	render(){

    return (
    	<div>
       
          <form>
          <div className="basic-info-form">

            <div className="basic-info-card card">
              <h4>Basic Info</h4>

              <div className="row">
                <div className="col-sm-6">
               
                  <div className={this.state.formErrors.first_name !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="fname" className="control-label">first name*</label>
                    <input onChange={this.handleUserInput} onBlur={this.handleInputOnBlur} type="text" name="first_name" value={this.state.formVal.first_name} id="fname" className="form-control" placeholder="First Name" />
                    <p><span>{this.state.formErrors.first_name !== '' ? this.state.formErrors.first_name : ''}</span></p>
                    
                  </div>
                </div>
                <div className="col-sm-6">
                 
                  <div className={this.state.formErrors.last_name !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="lname" className="control-label">Last Name*</label>
                    <input onChange={this.handleUserInput} name="last_name" onBlur={this.handleInputOnBlur} type="text" value={this.state.formVal.last_name} id="lname" className="form-control" placeholder="Last Name" />
                    <p><span>{this.state.formErrors.last_name !== '' ? this.state.formErrors.last_name : ''}</span></p>
                    
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12">
                 
                  <div className={this.state.formErrors.street_address !== '' ? 'form-group global-error' : 'form-group'}>
                    <label className="control-label">street address*</label>
                    <textarea onBlur={this.handleInputOnBlur} name="street_address" value={this.state.formVal.street_address} onChange={this.handleUserInput} className="form-control" placeholder="Street Address"></textarea>
                    <p><span>{this.state.formErrors.street_address !== '' ? this.state.formErrors.street_address: ''}</span></p>
                    
                  </div>
                </div>
                
              </div>

              <div className="row">
                <div className="col-sm-6">
               
                  <div className={this.state.formErrors.city !== '' ? 'form-group global-error' : 'form-group'}>       
                    <label htmlFor="city" className="control-label">City*</label>
                    <input onBlur={this.handleInputOnBlur} type="text" name="city" value={this.state.formVal.city} id="city" onChange={this.handleUserInput} className="form-control" placeholder="City"/>
                    <p><span>{this.state.formErrors.city !== '' ? this.state.formErrors.city : ''}</span></p>
                    
                  </div>
                </div>
                <div className="col-sm-6">
               
                  <div className={this.state.formErrors.state_id !== '' ? 'form-group global-error' : 'form-group'}>       
                    <label htmlFor="" className="control-label">State*</label>
                    <div className="select-wrapper">  
                      <select onBlur={this.handleInputOnBlur} className="select-simple" name="state_id" value={this.state.formVal.state_id} onChange={this.handleUserInput} className="form-control pmd-select2">
                        <option value=''>Select state</option>
                        {this.state.state_coll}
                      </select>
                      
                    </div>
                    <p><span>{this.state.formErrors.state_id !== '' ? this.state.formErrors.state_id : ''}</span></p>
                    
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6">
                  
                  <div className={this.state.formErrors.zipcode !== '' ? 'form-group global-error' : 'form-group'}>
                    <label htmlFor="zipcode" className="control-label">zip code*</label>
                    <input onBlur={this.handleInputOnBlur} type="text" name="zipcode" value={this.state.formVal.zipcode} id="zipcode" onChange={this.handleUserInput} className="form-control" placeholder="Zip code"/>
                    <p><span>{this.state.formErrors.zipcode !== '' ? this.state.formErrors.zipcode : ''}</span></p>
                               
                  </div>
                </div>
                <div className="col-sm-6">
                <div className={this.state.formErrors.phone_number !== '' ? 'form-group global-error' : 'form-group'}>

                  <label htmlFor="phone_number" className="control-label">Phone Number*</label>
                
                  <MaskedInput phonevalue={this.state.formVal.phone_number} isReverse={false} mask={"000-000-0000"} onblur={this.handleInputOnBlur} getvalue={this.getMaskedVal}/>
                  <p><span>{this.state.formErrors.phone_number !== '' ? this.state.formErrors.phone_number : ''}</span></p>
                 </div>
                </div>
              </div>

            </div>

         </form>
        </div>
    );
  }
}

