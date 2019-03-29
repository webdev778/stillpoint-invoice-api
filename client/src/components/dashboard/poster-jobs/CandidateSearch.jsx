import React from 'react';
import { Link } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { Truncate } from 'react-read-more';
import Select from 'react-select'

import { Dashboard } from '../../index';
import { constant, utils } from '../../../shared/index';

export default class CandidateSearch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      totalCandidateCount: 0,
      activePage: 1,
      candidateData: [],
      isResponse: false,
      practice_area_dropdown: [],
      state_dropdown: [],
      practiceAreas: [],
      states: []
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.setMultiSelectValues = this.setMultiSelectValues.bind(this);
  }

  componentDidMount() {
    let that = this;
    let userRole = constant['ROLE']['POSTER'];
    const practiceAreaList = utils.getListData('practice_areas')
    const statesList = utils.getListData('states')
    const practiceAreas = [];
    const states = [];

    for (let pAreasObj of practiceAreaList) {
      practiceAreas.push({value: pAreasObj['_id'], label: pAreasObj['name']});
    }

    for (let statesObj of statesList) {
      states.push({value: statesObj['_id'], label: statesObj['name']});
    }

    that.setState({
      practice_area_dropdown: practiceAreas,
      state_dropdown: states
    })

    utils.apiCall('GET_CANDIDATES_DATA', {}, function(err, response) {
      if (err) {
        utils.flashMsg('show', 'Error while getting Candidates data');
        utils.logger('error', 'Get Candidate Data Error -->', err)
      } else {
        if (utils.isResSuccess(response)) {

          that.setState({
            candidateData: response.data.data
          })
        }
      }
    })
  }

  setMultiSelectValues (val, key) {
    var stateObj = this.state;
    stateObj[key] = val;
    this.setState(stateObj)
  }

  handlePageChange(pageNumber) {
    utils.changeUrl(constant['ROUTES_PATH']['CANDIDATE_SEARCH'] + '?page=' + pageNumber);
  }

  getPhotoUrl(imgPath) {
    let photoUrl = constant['IMG_PATH'] + 'default-profile-pic.png';
    if(imgPath) {
      let apiConfig = config.getConfiguration();
      photoUrl = apiConfig.S3_BUCKET_URL + imgPath;
    }
    return photoUrl;
  }

  getPracticeAreas(pAreasArr) {
    let arr = utils.getListDataRelatedToIds('practice_areas', pAreasArr).map(function(item) {
      return item.name;
    });
    let len = arr.length;

    return (
      len > 0 ?
        <div className="col-sm-4">
          <span className="d-inline-block truncate-80">
            <i className="fa fa-bookmark" aria-hidden="true"></i>
            {arr.slice(0, 2).join(", ")}
          </span>
          {len > 2 ? <span className="d-inline-block v-bottom"> +{len - 2}</span> : null }
        </div>
      :
        null
    )
  }

  userDetailLink(userId) {
    let routesPath = constant['ROUTES_PATH'];
    return {
      pathname: routesPath['PROFILE'] + '/' + userId,
      state: {
        jobId: this.props.jobId
      }
    }
  }

  getLocations(statesArr) {
    let arr = utils.getListDataRelatedToIds('states', statesArr).map(function(item) {
      return item.name;
    });
    let len = arr.length;

    return (
      len > 0 ?
        <div className="col-sm-4">
          <span className="d-inline-block truncate-80">
            <i className="fa fa-bookmark" aria-hidden="true"></i>
            {arr.slice(0, 2).join(", ")}
          </span>
          {len > 2 ? <span className="d-inline-block v-bottom"> +{len - 2}</span> : null }
        </div>
      :
        null
    )
  }

  render() {
    const {candidateData, practiceAreas, states} = this.state

    return (
      <Dashboard>
        <ToastContainer />
        <section className="job-details-wrapper">
          <div className="section-head">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active">Dashboard</li>
              <li className="breadcrumb-item active">Job Posting</li>
              <p>Candidate Search</p>
            </ol>
          </div>
          <div className="bg-white widget-wrapper clearfix">
            <div className="search-filter-box m-30">
              <div className="col-sm-5">
                <div className="form-group">
                  <label className="control-label">Practice Area</label>
                  <Select multi closeOnSelect = {false} onBlurResetsInput = {true} autosize = {false}
                    onChange={(val) => this.setMultiSelectValues(val, 'practiceAreas')}
                    options={this.state.practice_area_dropdown}
                    placeholder="Select Practice Area(s)"
                    value={practiceAreas} />
                </div>
              </div>
              <div className="col-sm-5">
                <div className="form-group">
                  <label className="control-label">State</label>
                  <Select multi closeOnSelect = {false} onBlurResetsInput = {true} autosize = {false}
                    onChange={(val) => this.setMultiSelectValues(val, 'states')}
                    options={this.state.state_dropdown}
                    placeholder="Select State(s)"
                    value={states} />
                </div>
              </div>
              <button type="button" className="btn ml-10 btn-primary mt-30" onClick={this.handleSearch}>
                Search
              </button>
            </div>
            <div className="candidate-search-card mb-30">
              <div className="status-content mt-45">
                <div className="candidates-applied column-flex">
                  {
                    candidateData.map((item, index) => (
                      <div key={index} className="candidate-data">
                        <div className="pull-left pr-30">
                          <img src={this.getPhotoUrl(item.job_seeker_info.network.photo)} alt="profile-img" onError={this.profileImgError} />
                        </div>
                        <div className="right-panel p-0">
                          <div className="row m-0">
                            <Link to={this.userDetailLink(item._id)} className="job-title mb-10">
                              {item.first_name + ' ' + item.last_name}
                            </Link>
                          </div>
                          <div className="row sub-titles">
                            {
                              this.getPracticeAreas(item.job_seeker_info.basic_profile.practice_area_id)
                            }
                            {
                              this.getLocations(item.job_seeker_info.job_profile.willing_to_work_location_id)
                            }
                            <span className="clearfix"></span>
                          </div>
                          <p className="para mt-10 mb-20">
                            <Truncate lines={2} ellipsis={<span>... <Link className="more" to={this.userDetailLink(item._id)}>more</Link></span>}>
                              {item.job_seeker_info.network.about_lawyer}
                            </Truncate>
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          { this.state.totalCandidateCount > 0 ?
            <div>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.itemsCountPerPage}
                totalItemsCount={this.state.totalCandidateCount}
                pageRangeDisplayed={10}
                onChange={this.handlePageChange}
              />
              <span className="clearfix"></span>
            </div>
            : ''
          }
        </section>
        <span className="clearfix"></span>
      </Dashboard>
    );
  }
}
