import React from 'react';
import Util from '../common/Util.js';
import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import {ApiCall} from '../server/config/util.js';

export default class AdminDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded : true,
      resError : '',
    }
    this.exportUsers = this.exportUsers.bind(this);
    this.exportPostJobs = this.exportPostJobs.bind(this);
    this.getCsvFileName = this.getCsvFileName.bind(this);
  }

  getCsvFileName(type) {
    return (type + '_' + Util.getDate() + '_' + Util.getTime() + '.csv');
  }

  exportUsers() {
    var _this = this;
    this.setState({loaded:false},function(){
      ApiCall('get', '/exportUsers', {}, Util.getToken(), function(err, response){
        if (err) {
          console.log("error : ",err);
        } else {
          if (response.data.Status === false){
            console.log("error : ",err);
            Util.showHideFlashMsg();
            _this.setState({resError: true});
          } else {
            // console.log(response);
            _this.setState({resError: false});
            var blob = new Blob([response.data],{type: "text/csv;charset=utf-8;"});
            if (navigator.msSaveBlob) { // IE 10+
              navigator.msSaveBlob(blob, _this.getCsvFileName('users'));
            } else {
              var link = document.createElement("a");
              if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", _this.getCsvFileName('users'));
                // link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }
          }
        }
        setTimeout(() => {
          _this.setState({loaded:true})
        }, 500);
      })
    });
  }

  exportPostJobs() {
    var _this = this;
    this.setState({loaded:false},function(){
      ApiCall('get', '/exportPostJobs', {}, Util.getToken(), function(err, response){
        if (err) {
          console.log("error : ",err)
        } else {
          if (response.data.Status === false){
            console.log("error : ",err);
            Util.showHideFlashMsg();
            _this.setState({resError: true});
          } else {
            // console.log(response);
            _this.setState({resError: false});
            var blob = new Blob([response.data],{type: "text/csv;charset=utf-8;"});
            if (navigator.msSaveBlob) { // IE 10+
              navigator.msSaveBlob(blob, _this.getCsvFileName('post_jobs'));
            } else {
              var link = document.createElement("a");
              if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", _this.getCsvFileName('post_jobs'));
                // link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }
            // let csvContent = "data:text/csv;charset=utf-8,"+response.data;
            // var encodedUri = encodeURI(csvContent);
            // var link = document.createElement("a");
            // link.setAttribute("href", encodedUri);
            // link.setAttribute("download", _this.getCsvFileName('post_jobs'));
            // document.body.appendChild(link);
            // link.click();
          }
        }
        setTimeout(() => {
          _this.setState({loaded:true})
        }, 500);
      })
    });
  }

  render() {
    return (
      <div>
      <Commonheader />
        <div className="thank-you-container content-wrapper container">
          <div className="thank-you-form form">
            <div className="thank-you-card card">
              <button type="button" className="btn" onClick={this.exportUsers}>Export users</button>
              <button type="button" className="btn" onClick={this.exportPostJobs}>Export post jobs</button>
            </div>
          </div>
          {this.state.resError == true ? (<div className="alert alert-danger fixed-alert">Oops!! Something went wrong.</div>): ''}
        </div>
        <Commonfooter />
        <div className={this.state.loaded ? 'fade-layer d-none' : 'fade-layer'}>
          <div className="loader"></div>
        </div>
      </div>
    );
  }
}
