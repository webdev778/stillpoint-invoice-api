import React from 'react';
import Pagination from 'react-js-pagination';

import { Dashboard, Job, NoRecordFound } from '../../index';
import { constant, utils, cookieManager } from '../../../shared/index';
import ModalPopup from '../../shared/modal-popup/ModalPopup';


export default class JobSearch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      jobRecords: [],
      activePage: 1,
      totalJobCount: 0,
      itemsCountPerPage: 10,
      userRelatedData: '',
      isResponse: false,
      modalPopupObj: {},
      freezeActivity: false
    };
    this.getJobListings = this.getJobListings.bind(this);
    this.getAllDropdownsData = this.getAllDropdownsData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  getFilterData(filterArr = [], filterId) {
    return filterArr.filter(function(filter) {
      return filter._id == filterId;
    });
  }

  getAllDropdownsData() {
    let that = this;
    utils.apiCall('GET_ALL_LISTS', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Dropdown Data');
        utils.logger('error', 'Get All List Error -->', err);
      } else {
        if (utils.isResSuccess(response)) {
          let data = utils.getDataFromRes(response);
          that.setState({
            userRelatedData: data
          });
        } else {
          utils.flashMsg('show', utils.getServerErrorMsg(response));
        }
      }
    });
  }

  getJobListings(){
    let that = this;
    utils.apiCall('GET_JOBS', { 'params': [that.state.activePage] }, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Jobs');
        utils.logger('error', 'Get Jobs Error -->', err);
      } else {
        if (response.data.Code == 200 && response.data.Status == true) {
          window.scrollTo(0, 0);
          let responseData = response.data.Data;
          let jobRecords = responseData.data;
          let totalJobCount = responseData.count;
          that.setState({
            jobRecords: jobRecords,
            totalJobCount: totalJobCount,
            freezeActivity: responseData.userData.freeze_activity,
            isBarIdValid: responseData.userData.is_bar_id_valid
          });
        } else {
          utils.logger('warn', utils.getServerErrorMsg(response));
        }
        that.setState({
          isResponse: true
        });
      }
    });
  }

  handlePageChange(pageNumber) {
    utils.changeUrl(constant['ROUTES_PATH']['JOB_SEARCH'] + '?page=' + pageNumber);
    this.loadSearchData();
  }

  loadSearchData() {
   let page = utils.getParameterByName('page');
    if(!page) {
      page = 1;
    }
    this.setState({
      activePage: Number(page)
    }, function() {
      this.getJobListings();
    });
  }

  componentDidMount() {
    this.getAllDropdownsData();
    this.loadSearchData();
  }

  render() {
    var jobRecordsLength = this.state.jobRecords.length;
    var jobs = this.state.jobRecords.map(function(job) {
      job.fromRoute = 'SEARCH_JOBS';
      job.step = job.job_step;
      job.nTermStatus = (job.n_terms_status && job.n_terms_status.length) ? job.n_terms_status[0] : 0;
      job.declinedBy = job.declined_by || '';
      job.modalPopupObj = this;
      return (
        <Job key={job._id} job={job} userRelatedData={this.state.userRelatedData} freezeActivity={this.state.freezeActivity} isBarIdValid={this.state.isBarIdValid}/>
      )
    }.bind(this));

    return (
      <Dashboard>
        <section className="job-search-wrapper">
          <div className="section-head">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
              <li className="breadcrumb-item active">Job Searching</li>
              <p>Job Search</p>
            </ol>
          </div>
          <div className="job-search-card mb-30">
            <div className="card-head hide"></div>
            { this.state.isResponse ? (jobRecordsLength > 0 ? <div>{jobs}</div> : <NoRecordFound />) : null }
          </div>
          { this.state.totalJobCount > 0 ?
            <div>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.itemsCountPerPage}
                totalItemsCount={this.state.totalJobCount}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
              />
              <span className="clearfix"></span>
            </div>
          : '' }
        </section>
        <span className="clearfix"></span>
        <ModalPopup modalPopupObj={this.state.modalPopupObj} />
      </Dashboard>
    );
  }
}
