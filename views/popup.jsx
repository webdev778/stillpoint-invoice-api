import React from 'react';
import { Link, browserHistory } from 'react-router';
import Util from '../common/Util.js';

export default class Popup extends React.Component {
    constructor (props) {
    super(props);
   this.hidePopup = this.hidePopup.bind(this);
   this.goTo = this.goTo.bind(this);
     /* this.redirectionHandle = this.redirectionHandle.bind(this);*/
  }
   hidePopup(){
    $('#myPopup').modal('hide');
   }
   goTo(){
    browserHistory.push(this.props.url);
    $('#myPopup').modal('hide');
   }
  /* redirectionHandle(){
    if(this.props.url.index)
    cookieManager.setCookie('fromButton',JSON.stringify({"homeButton":}));
   }
 */
    render(){
    return (
        <div className="del-photo-modal modal fade in" id="myPopup">
          <div className="modal-dialog modal-sm">
             <div className="modal-content">
             <div className="modal-header mb-0">
                <button type="button" className="close" onClick={this.hidePopup}>×</button>
              </div>
              <div className="modal-body mt-0">
                <div className="text-center pb-15"><img className="alert-img" src="../images/danger.png" /></div>
                {this.props.content}             
              </div>
              <div className="modal-footer">
             {/*  <button className="btn-blue btn" onClick={()=>this.redirectionHandle}>Leave</button>
               */}
            <button className="btn-blue btn" onClick={()=>Util.navigateBtWTabs(this.props.obj,this.props.url)}>Leave</button>
            
            </div>
            </div>
          </div>
        </div>
    );
  }
}
