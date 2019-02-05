import React from 'react';
import { Link, browserHistory } from 'react-router';

import Commonheader from './header.jsx';
import Commonfooter from './footer.jsx';

import Util from '../common/Util.js';
import WebService from '../common/WebService.js';

class JobList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            id: 1234566778890,
            subTab: 'all',
            selectedPage: 1,
            recordsPerPage: 10,
            filter: {},
            jobList: [{
                "jobHeadline": "Lawyer - IP Litigation",
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
                "state": "AZ",
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
                }],
                createdBy: 'Rajesh'
            }]
        }

        this.fetchJobList = this.fetchJobList.bind(this);
        this.setInput = this.setInput.bind(this);
        this.changeTabAndFetchJob = this.changeTabAndFetchJob.bind(this);
        this.onClickChangeTabAndFetchJob = this.onClickChangeTabAndFetchJob.bind(this);
        this.checkUncheckJob = this.checkUncheckJob.bind(this);
        this.renderPaginationItem = this.renderPaginationItem.bind(this);
        this.onPrevNextPagination = this.onPrevNextPagination.bind(this);
        this.gotoJobDetailPage = this.gotoJobDetailPage.bind(this);
        this.onSelectFilter = this.onSelectFilter.bind(this);
        this.changeJobState = this.changeJobState.bind(this);
        this.setFilterKeyVal = this.setFilterKeyVal.bind(this);
        this.searchJobs = this.searchJobs.bind(this);
    }

    componentDidMount() {
        this.fetchJobList();
    }
    
    setInput (e, stateKey) {
        var stateObj = {};
        stateObj[stateKey] = e.target.value;
        
        this.setState(stateObj);
    }
    
    checkUncheckJob (e, index) {
        
        var jobList = this.state.jobList;
        jobList[index].selected = e.target.checked;
        
        this.setState({jobList: jobList});
    }
    
    searchJobs () {
        console.log(this.state.filter);
        
        // XMLHTTP CALL
    }
    
    setFilterKeyVal (ev, key) {
        var stateObj = this.state.filter;
        
        stateObj[key] = ev.target.value;
        this.setState({filter: stateObj});
    }
    setStateKeyVal (key, val) {
        var stateObj = {};
        stateObj[key] = val
        this.setState(stateObj);
    }
    
    changeTabAndFetchJob (e, stateKey) {
        this.setInput(e, stateKey);
        this.fetchJobList();
    }
    
    onClickChangeTabAndFetchJob(key, val) {
        this.setStateKeyVal(key, val);
        this.fetchJobList();
    }
    
    onSelectFilter (e) {
        var action = e.target.value, jobIdsArr = [];
        
        if(!action) return;
        
        var jobList = this.state.jobList;
        
        jobIdsArr = jobList.map((job) => {
            if(job.selected) {
                return job.id
            }
        });
        
        this.changeJobState(action, jobIdsArr)
    }
    
    changeJobState (action, jobIdsArr) {
        console.log(jobIdsArr);
        
        // http req.
        
        // http req to fetch jobs
    }
    
    gotoJobDetailPage (id) {
        var baseUrl = location.origin + '/previewJob';
        var arr = [{'key':"jobId",'value': id || 1234567890}];
        var url= Util.insertParam(arr);
        url = Util.removeParam("jobId", url);
        Util.changeUrl(baseUrl+ url);
    }

    fetchJobList () {
        var _this = this;
        WebService.executeHttpRequest(WebService.HTTP_METHODS.GET, WebService.API_URL.GET_JOB_LIST, null, null, function(response) {
            if(!response.status) {
                // handle error
            } else {
                _this.setState({statesArr: response.Data || []});
            }
        });
    }
    
    onPrevNextPagination (key, val) {
        if(val > 20 ||  val < 1){
            return;
        }
        this.setStateKeyVal(key, val);
    }
    
    renderPaginationItem () {
        
        var elements = [];
        
        var recordsLength = 200;
        var recordsPerPage = this.state.recordsPerPage;
        
        var noOfPages = recordsLength/recordsPerPage;

        var startingIndex = 1;
        var lastIndex = 10;
        
        if(this.state.selectedPage > 5) {
            startingIndex = (this.state.selectedPage - 5) + 1;
            lastIndex = (startingIndex + 10 ) - 1;
        }
        
        lastIndex = lastIndex > noOfPages ? noOfPages : lastIndex;
        startingIndex = (lastIndex - 10 ) + 1;
        
        for(let i=startingIndex;i<=lastIndex;i++) {
            elements.push(<a href="javascript:void(0)" onClick={() => this.setStateKeyVal('selectedPage', i)} 
            className={(this.state.selectedPage == i ? "active" : "")} key={i}>{i}</a>)
        }
        
        return(elements);
    }

    render(){

        var jobList = this.state.jobList;
        jobList.forEach((jobDetails) => {
            jobDetails.hoursType = jobDetails.hoursType ? jobDetails.hoursType.toUpperCase() : '';
        });

	    return (
            <div>
                <Commonheader></Commonheader>
                    <div className="static-heading" >
                        <div className="search-form text-center">
                             <form className="form-inline">
                              <div className="form-group">
                                <input type="text" name="name" className="form-control" id="name" placeholder="Legal Lawyer" onChange={(e) => this.setFilterKeyVal(e, 'lawer')}/>
                              </div>
                              <div className="form-group">
                                <input type="text" name="place" className="form-control" id="place" placeholder="New York" onChange={(e) => this.setFilterKeyVal(e, 'city')}/>
                              </div>

                              <button type="button" className="post-job-btn" onClick={this.searchJobs}>Search</button>
                            </form> 

                        </div>
                    </div>
                
                    <div className="content-wrapper container job-container">
                        <div className="posted-jobs">
                            <h3 className="main-head"><img className="job-arrow" src="images/arrow-left.png" alt="images" /> Jobs</h3>

                            <div className="mobile-job-tab">
                                <select className="form-control" onChange={(e) => this.changeTabAndFetchJob(e, 'subTab')}>
                                    <option value="all">All</option>
                                    <option value="saved">Saved</option>
                                    <option value="posted">Posted</option>
                                    <option value="applied">Applied</option>
                                </select>
                            </div>


                            <div className="pmd-card">
                                <div className="pmd-tabs">
                                    <div className="pmd-tab-active-bar"></div>
                                    <ul className="nav nav-tabs" role="tablist">
                                        <li role="presentation" className="active" onClick={(e) => this.onClickChangeTabAndFetchJob('subTab', 'all')}><a href="#home" aria-controls="home" role="tab" data-toggle="tab">All</a></li>
                                        <li role="presentation" onClick={(e) => this.onClickChangeTabAndFetchJob('subTab', 'saved')}><a href="#home" aria-controls="about" role="tab" data-toggle="tab">Saved</a></li>
                                        <li role="presentation" onClick={(e) => this.onClickChangeTabAndFetchJob('subTab', 'posted')}><a href="#home" aria-controls="work" role="tab" data-toggle="tab">Posted</a></li>
                                        <li role="presentation" onClick={(e) => this.onClickChangeTabAndFetchJob('subTab', 'applied')}><a href="#home" aria-controls="applied" role="tab" data-toggle="tab">Applied</a></li>
                                    </ul>
                                </div>
                                <div className="pmd-card-body">
                                    <div className="tab-content">
                                        <div role="tabpanel" className="tab-pane active" id="home">
                                            <ul className="searched-list job-search-list">
                                                <li className="border0">
                                                    <div className="job-head">
                                                    </div>
                                                    <div className="job-active">
                                                        {this.state.subTab == 'posted' ?
                                                            <select className="form-control" onChange={(e) => this.onSelectFilter(e)}>
                                                                <option value="">Set Status</option>
                                                                <option value="active">Active</option>
                                                                <option value="inactive">InActive</option>
                                                                <option value="interviewing">Interviewing</option>
                                                            </select>
                                                        : '' }
                                                    </div>
                                                </li>
                                                
                                                {jobList.map((jobDetails, index) =>
                                                <li key={index}>
                                                    <div className="job-info">
                                                        <div className="job-time">
                                                            <span className="timing">{jobDetails.hoursType}</span>
                                                            <div className="payment-info">
                                                                <span className="payment">
                                                                  <small>$</small>
                                                                  {jobDetails.rate}
                                                                </span> {jobDetails.rateType}
                                                            </div>
                                                        </div>

                                                        <h3 className="job-title" onClick={() => this.gotoJobDetailPage(jobDetails.id)}>{jobDetails.jobHeadline}</h3>
                                                        <div className="job-details">
                                                            <span className="industry">Legal Industry</span>
                                                            <span className="location">{jobDetails.state}, {jobDetails.city}</span>
                                                            <span className="duration">Less than 30 hrs/week. Less than 1 month</span>
                                                        </div>
                                                        
                                                        <div className="job-dec-main">
                                                            <label className={"checkbox-inline pmd-checkbox pmd-checkbox-ripple-effect" + ' ' + (this.state.subTab != 'posted' ? 'hide' : '')}>
                                                                <input type="checkbox" className="job-checkbox" value={index} checked={jobDetails.selected} onClick={(e) => this.checkUncheckJob(e, index)}/>
                                                            </label>
                                                            <p className="job-desc">
                                                                {jobDetails.jobDescription}
                                                            </p>
                                                        </div>

                                                        <div className="job-owner">
                                                            <div className="posted-by">
                                                                Posted by : <a href="#">{jobDetails.createdBy}</a>
                                                            </div>
                                                            <div className="job-apply"><img src="images/location.png" alt="images" />3 Applied</div>
                                                        </div>
                                                    </div>
                                                </li>
                                                )}
                                            </ul>
                                        </div>
                                        <div role="tabpanel" className="tab-pane" id="about">

                                        </div>
                                        <div role="tabpanel" className="tab-pane" id="work">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pagination">
                            <a className="prev" href="javascript:void(0)" onClick={() => this.onPrevNextPagination('selectedPage', this.state.selectedPage - 1)}>prev</a>
                            {this.renderPaginationItem()}
                            <a className="next" href="javascript:void(0)" onClick={() => this.onPrevNextPagination('selectedPage', this.state.selectedPage + 1)}>next</a>
                        </div>
                    </div>

                <Commonfooter></Commonfooter>
            </div>
        );
    }

}

export default JobList;
