import React from 'react';
import { Link } from 'react-router';
import { ToastContainer } from 'react-toastify';
import Pagination from 'react-js-pagination';

import { Dashboard } from '../../index';
import { constant, utils } from '../../../shared/index';

export default class CandidateSearch extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      totalCandidateCount: 0,
      activePage: 1,
      isResponse: false
    };

    this.handlePageChange = this.handlePageChange.bind(this);
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
          <div className="job-search-card mb-30">
            <div className="status-content mt-45">
              <div className="candidates-applied">
                <h6 className="mb-30">Here are avaliable candidates.</h6>
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
                        {
                          item.isDeclined ?
                            <div className="buttons text-right">
                              <button type="button" className="btn btn-grey-disabled" disabled>
                                {(item.declined_by === constant['ROLE']['SEEKER'] ? 'Candidate ' : '') + 'declined'}
                              </button>
                            </div>
                          :
                            item.freeze_activity ?
                              <div className="buttons text-right">
                                <button type="button" className="btn btn-primary seized-btn" onClick={this.onDeclineBtnClick.bind(this, jobId, (constant['JOB_STEPS']['APPLIED'] * -1), item._id, index)}>
                                  decline
                                </button>
                                <button type="button" className="btn btn-primary seized-btn" onClick={this.updateCandidateJobStatus.bind(this, jobId, constant['JOB_STEPS']['INTERVIEWING'], item._id, index)}>
                                  Interview
                                </button>
                                </div>
                            :
                              <div className="buttons text-right">
                                <button type="button" className="btn btn-primary" onClick={this.onDeclineBtnClick.bind(this, jobId, (constant['JOB_STEPS']['APPLIED'] * -1), item._id, index)}>
                                  decline
                                </button>
                                <button type="button" className="btn btn-primary" onClick={this.updateCandidateJobStatus.bind(this, jobId, constant['JOB_STEPS']['INTERVIEWING'], item._id, index)}>
                                  Interview
                                </button>
                              </div>
                        }
                      </div>
                    </div>
                  ))
                }
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
