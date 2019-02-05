import React from 'react';
import {Link, browserHistory} from 'react-router';

import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';
import Util from '../common/Util.js';
import WebService from '../common/WebService.js';

class PreviewJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPaymentSection: false,
            jobDetails: {}
        };
        
        this.fetchJobDetails = this.fetchJobDetails.bind(this);
        this.editJob = this.editJob.bind(this);
    }

    componentDidMount() {
        this.fetchJobDetails();
        
        // ************** below is the code to add query parameter.
        
//        var arr = [{'key':"jobId",'value': 123}];
//        var url= Util.insertParam(arr);
//        url = Util.removeParam("jobId", url);
//        Util.changeUrl(location.href + url);
        
        var jobId = this.props.location.query.jobId;
        var pSec = this.props.location.query.pSec;
        if(pSec) {
            this.setState({showPaymentSection: true});
        }
        this.fetchJobDetails (jobId);
    }
    
    componentWillReceiveProps (newProps) {
    }
    
    fetchJobDetails (jobId) {
        var _this = this;
        WebService.executeHttpRequest(WebService.HTTP_METHODS.GET, WebService.API_URL.GET_JOB, {jobId: jobId}, null, function(response) {
            if(!response.status) {
                // handle error
                _this.setState({
                    jobDetails: {
                        "jobHeadline": "Lawyer - IP Litigation",
                        "createdBy": "Rajesh",
                        "practiseArea": [{
                            "name": "Admiralty and Maritime Law",
                            "status": true
                        }],
                        "skillsNeeded": [{
                            "name": "Legal Writing",
                            "status": true
                        }],
                        "jobDescription": "In volutpat ultrices ornare. Curabitur convallis ligula lorem, quis rhoncus mi efficitur ac. Mauris dictum sagittis auctor. Donec porttitor vel magna sed faucibus. Aenean blandit, mauris non dignissim aliquam, sapien sem sodales tortor, ac tincidunt sapien nunc efficitur lorem. Nullam feugiat felis ligula, at ultrices eros euismod eu. Nam ut ante sed dolor suscipit mattis. Phasellus justo erat, convallis a scelerisque non, vehicula id nunc. In non malesuada dui. Pellentesque habitant morbiquess. <br/><br/>Integer sed mattis risus, sit amet tempor augue. Suspendisse varius felis sed ipsum commodo, vel euismod urna euismod. Fusce id libero ac mauris iaculis porttitor. Phasellus consectetur orci et quam rutrum, non scelerisque mi ornare. Curabitur efficitur dolor at tempor cursus. Curabitur arcu lacus, semper eget vulputate a, blandit non felis. Donec volutpat, augue non dignissim auctor, dolor enim scelerisque quam, ac pellentesque felis est a justo.",
                        "city": "Ny",
                        "state": "Aaska",
                        "zipCode": 12345,
                        "estimatedStartDate": "09/06/2017",
                        "duration": 11,
                        "durationPeriod": "weeks",
                        "rate": 500,
                        "rateType": "hourly",
                        "hours": 10,
                        "hoursType": "partTime",
                        "subTotal": 100,
                        "total": 115,
                        "paymentDetails": [{
                            "rate": 100,
                            "delivery": "1st delivery"
                        }, {
                            "rate": 15,
                            "delivery": "2nd delivery"
                        }]
                    }
                });  
            } else {
//                _this.setState({jobDetails: response.Data || {}}); 
            }
        });
    }
    
    editJob () {
        var baseUrl = location.origin + '/postJob';
        var arr = [{'key':"jobId",'value': 123}];
        var url= Util.insertParam(arr);
        url = Util.removeParam("jobId", url);
        url = Util.removeParam("pSec", url);
        Util.changeUrl(baseUrl + url);
    }

    render() {
        var jobDetails = this.state.jobDetails;
        jobDetails.hoursType = jobDetails.hoursType ? jobDetails.hoursType.toUpperCase() : '';
        return (
            <div>
                <Commonheader></Commonheader>
                <div className="content-wrapper container">

                    <div className="job-details-section">
                        <div className="col-xs-12 padding-zero">
                            <div className="lawyer-detail">
                                <span>{jobDetails.hoursType}</span>
                                <div className="name">{jobDetails.jobHeadline}</div>
                            </div>
                            <div className="lawyer-hours">
                                <div className="box">
                                    <div className="amount"><sup>$</sup>{jobDetails.hours}<span>Per {jobDetails.rateType}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 padding-zero">
                            <div className="lawyer-location-panel">
                                <div className="detailed-box">
                                    <i className="fa fa-map-marker"></i>
                                    <span>{jobDetails.state}, {jobDetails.city}</span>
                                </div>
                                <div className="detailed-box">
                                    <i className="fa fa-clock-o"></i>
                                    <span>{jobDetails.hours} Hrs</span>
                                </div>
                                <div className="detailed-box">
                                    <i className="fa fa-calendar"></i>
                                    <span>{jobDetails.estimatedStartDate}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12 padding-20">
                            <div className={"search-description-section" + ' ' + (this.state.showPaymentSection ? '' : 'w-100')}>
                                Description
                                <span>{jobDetails.jobDescription}</span>
                            </div>
                            {this.state.showPaymentSection ? <div className="search-details-section">
                                <div className="search-details-box">Hours <span>{jobDetails.hours} {jobDetails.hoursType}</span></div>
                                <div className="search-details-box">Subtotal <span>${jobDetails.subTotal}</span></div>
                                <div className="search-details-box">Total <span>${jobDetails.total}</span></div>
                                <div className="clear-fix"></div>
                                <div className="search-payment-section">
                                    payment details and schedule
                                    {jobDetails.paymentDetails && jobDetails.paymentDetails.length ? jobDetails.paymentDetails.map((paymentDetail, index) =>
                                        <span key={index}>${paymentDetail.rate} on {paymentDetail.delivery}</span>
                                    ) : ''}
                                </div>
                            </div> : ''}
                        </div>
                        <div className="col-xs-12 padding-zero">
                            <div className="job-category-section">
                                <span>Skills needed</span>
                                {
                                    jobDetails.skillsNeeded && jobDetails.skillsNeeded.length ? 
                                    jobDetails.skillsNeeded.map((skills, index) =>
                                        <div key={index} className="job-category-name">{skills.name}</div>
                                    ) : ''
                                }
                            </div>
                            <div className="job-postedby-section">
                                Posted by :
                                <span> {jobDetails.createdBy}</span>
                            </div>
                        </div>
                        
                        <div className="col-xs-12 padding-zero">
                            <div className="job-category-section">
                                <span>Practise Area</span>
                                {
                                    jobDetails.practiseArea && jobDetails.practiseArea.length ? 
                                    jobDetails.practiseArea.map((category, index) =>
                                        <div key={index} className="job-category-name">{category.name}</div>
                                    ) : ''
                                }
                            </div>
                        </div>
                        <div className="col-xs-12 padding-zero text-btn-center">
                            <button type="button" className="btn-blue edit-job-btn" onClick={this.editJob}>Edit Job</button>
                            <button type="button" className="btn-blue post-job-button">Post Job</button>
                        </div>
                    </div>

                </div>
                <Commonfooter></Commonfooter>
            </div>
        );
    }
}

export default PreviewJob;
