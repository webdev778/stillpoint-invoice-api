import React from 'react';
import {Link, browserHistory} from 'react-router';

import {constant, utils, cookieManager, config} from '../../../shared/index';
import {Dashboard} from '../../index';
import ModalPopup from '../../shared/modal-popup/ModalPopup';

let classNames = require('classnames');

export default class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            relatedData: '',
            seekerData: null,
            posterData: null,
            firstName: '',
            lastName: '',
            seekerState: '',
            seekerEducations: [],
            seekerSkills: [],
            seekerPracticeAreas: [],
            seekerExperiences: [],
            posterPracticeAreas: [],
            posterPracticeLocations: [],
            posterInterestedIns: [],
            currentTab: 'Attorney Profile',
            initialLoadedSection: props.params.section,
            profileImage: '',
            writingSamples: '',
            resume: '',
            resumeUrl: '',
            isResponse: false,
            modalPopupObj: {}
        };
        this.getUserProfile = this.getUserProfile.bind(this);
        this.setUserRelatedData = this.setUserRelatedData.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.profileImgError = this.profileImgError.bind(this);
        this.viewWritingSamples = this.viewWritingSamples.bind(this);
        this.getFullYear = this.getFullYear.bind(this);
        this.isAttorneyProfile = this.isAttorneyProfile.bind(this);
        this.isFirmProfile = this.isFirmProfile.bind(this);
        this.isOtherProfile = this.isOtherProfile.bind(this);
        this.isCandidate = this.isCandidate.bind(this);
    }

    setStateObj(obj) {
        if (this.refs.profileRef) {
            this.setState(obj);
        }
    }

    changeTab(e) {
        let targetText = e.target.text;
        let path = (targetText === 'Firm Profile') ? 'firm' : 'attorney';
        utils.changeUrl(constant['ROUTES_PATH']['PROFILE'] + '/' + path);

        let obj = {
            currentTab: targetText
        }
        this.setStateObj(obj);
    }

    getMonth(date) {
        let mm = ('0' + (new Date(date).getUTCMonth() + 1)).slice(-2);
        return (date && mm);
    }

    getFullYear(date) {
        return (date && new Date(date).getFullYear());
    }

    getUserProfile() {
        let that = this;
        let section = location.pathname.substr(location.pathname.lastIndexOf('/') + 1)
        utils.apiCall('GET_USER_PROFILE', {'params': ['job_seeker_info', 'job_posters_info', section]}, function (err, response) {
            if (err) {
                utils.flashMsg('show', 'Error while getting User Profile');
                utils.logger('error', 'Get User Profile Error -->', err);
            } else {
                if (response.data.Code == 200 && response.data.Status == true) {
                    let responseData = response.data.Data;
                    that.setUserRelatedData(responseData);
                } else {
                    utils.flashMsg('show', response.data.Message);
                }

                let obj = {
                    isResponse: true
                }
                that.setStateObj(obj);
            }
        });
    }

    getFilterData(filterArr = [], filterId) {
        return filterArr.filter(function (filter) {
            return filter._id == filterId;
        });
    }

    setSeekerData(userObj, listsObj) {
        let that = this;

        let firstName = userObj.first_name;
        let lastName = userObj.last_name;

        let seekerData = userObj.job_seeker_info;
        let seekerBasicProfile = seekerData.basic_profile;
        let seekerBasicInfo = seekerBasicProfile.basic_info;
        let seekerStateId = seekerBasicInfo.state_id;
        let seekerEducation = seekerBasicProfile.education;
        let seekerSkill = seekerBasicProfile.skill_used_id;
        let seekerPracticeArea = seekerBasicProfile.practice_area_id;
        let seekerExperience = seekerData.experience;
        let seekerJobProfile = seekerData.job_profile;
        let seekerBarAdmission = seekerBasicProfile.bar_admission;
        let seekerWritingSamples = seekerData.network.writing_samples;

        let states = listsObj.states;
        let degrees = listsObj.degrees;
        let skills = listsObj.skills;
        let employment_types = listsObj.employment_types;
        let practices = listsObj.practice_areas;
        let work_locations = listsObj.work_locations;

        let seekerState = that.getFilterData(states, seekerStateId);
        let seekerStateName = '';
        if (seekerState.length > 0) {
            seekerStateName = seekerState[0].name;
        }

        let seekerEducations = [];
        for (let i = 0; i < seekerEducation.length; i++) {
            let educationObj = seekerEducation[i];
            let degree = that.getFilterData(degrees, educationObj.degree_id);
            if (degree.length) {
                educationObj.degree = degree[0].name;
            }
            seekerEducations.push(educationObj);
        }

        let seekerSkills = [];
        for (let i = 0; i < seekerSkill.length; i++) {
            let skill = that.getFilterData(skills, seekerSkill[i]);
            if (skill.length) {
                let skillName = skill[0]['name'];
                if (skillName && skillName.toLowerCase() === 'others') {
                    seekerBasicProfile && seekerBasicProfile['others'] && seekerSkills.push(seekerBasicProfile['others']);
                } else {
                    seekerSkills.push(skillName);
                }
            }
        }

        let practiceAreas = [];
        for (let i = 0; i < seekerPracticeArea.length; i++) {
            let practiceArea = that.getFilterData(practices, seekerPracticeArea[i]);
            if (practiceArea.length) {
                practiceAreas.push(practiceArea[0].name);
            }
        }

        for (let i = 0; i < seekerExperience.length; i++) {
            let employmentTypes = [], seekerSkillsUsed = [];
            ;
            let seekerEmploymentTypeIDs = seekerExperience[i].employment_type_id;
            let seekerSkillsUsedIDs = seekerExperience[i].skill_used_id;
            for (let j = 0; j < seekerEmploymentTypeIDs.length; j++) {
                let employmentType = that.getFilterData(employment_types, seekerEmploymentTypeIDs[j]);
                if (employmentType.length) {
                    employmentTypes.push(employmentType[0].name);
                }
            }
            for (let j = 0; j < seekerSkillsUsedIDs.length; j++) {
                let skill = that.getFilterData(skills, seekerSkillsUsedIDs[j]);
                if (skill.length) {
                    let skillName = skill[0]['name'];
                    if (skillName && skillName.toLowerCase() === 'others') {
                        seekerExperience[i] && seekerExperience[i]['others'] && seekerSkillsUsed.push(seekerExperience[i]['others']);
                    } else {
                        seekerSkillsUsed.push(skillName);
                    }
                }
            }
            seekerExperience[i].employment_types = employmentTypes;
            seekerExperience[i].skill_used = seekerSkillsUsed;
        }

        let desireJobTypes = seekerJobProfile.desired_job_type;
        for (let i = 0; i < desireJobTypes.length; i++) {
            let employmentType = that.getFilterData(employment_types, desireJobTypes[i].employment_type_id);
            if (employmentType.length) {
                desireJobTypes[i].employment_type = employmentType[0].name;
            }
        }
        seekerJobProfile.desired_job_type = desireJobTypes;

        let willingToWorkLocationIds = seekerJobProfile.willing_to_work_location_id;
        let willingToWorkLocations = [];
        for (let i = 0; i < willingToWorkLocationIds.length; i++) {
            let work_location = that.getFilterData(states, willingToWorkLocationIds[i]);
            if (work_location.length) {
                willingToWorkLocations.push(work_location[0].name);
            }
        }
        seekerJobProfile.willing_to_work_location_id = willingToWorkLocations;

        for (let i = 0; i < seekerBarAdmission.length; i++) {
            let state = that.getFilterData(states, seekerBarAdmission[i].bar_state_id);
            if (state.length) {
                seekerBarAdmission[i].bar_state_name = state[0].name;
            }
        }

        let photoUrl = seekerData.network.photo;
        let resume = seekerData.network.resume;
        let seekerProfileImage = '';
        let resumeUrl = '';

        if (photoUrl || resume) {
            let apiConfig = config.getConfiguration();
            let s3BucketUrl = apiConfig.S3_BUCKET_URL;
            seekerProfileImage = (photoUrl ? s3BucketUrl + photoUrl : '');
            resumeUrl = (resume ? s3BucketUrl + resume : '');
        }

        let writingSamples = [];
        if (seekerWritingSamples.length > 0) {
            let apiConfig = config.getConfiguration();
            let s3BucketUrl = apiConfig.S3_BUCKET_URL;
            for (let i = 0; i < seekerWritingSamples.length; i++) {
                if (seekerWritingSamples[i].path) {
                    let obj = seekerWritingSamples[i];
                    let name = seekerWritingSamples[i].name;
                    let filUrl = s3BucketUrl + seekerWritingSamples[i].path;
                    obj.name = name.slice(0, name.indexOf('.'));
                    obj.path = filUrl;
                    writingSamples.push(obj);
                }
            }
        }

        let obj = {
            seekerState: seekerStateName,
            seekerEducations: seekerEducations,
            firstName: firstName,
            lastName: lastName,
            seekerSkills: seekerSkills,
            seekerPracticeAreas: practiceAreas,
            seekerExperiences: seekerExperience,
            seekerJobProfile: seekerJobProfile,
            seekerBarAdmission: seekerBarAdmission,
            seekerData: seekerData,
            seekerProfileImage: seekerProfileImage,
            writingSamples: writingSamples,
            resume: resume,
            resumeUrl: resumeUrl
        }
        that.setStateObj(obj);
    }

    setPosterData(userObj, listsObj) {
        let that = this;

        let posterData = userObj.job_posters_info;
        let posterBasicProfile = posterData.basic_profile;
        let posterBasicInfo = posterBasicProfile.basic_info;
        let posterStateId = posterBasicInfo.state_id;
        let posterIntrestedInIds = posterBasicProfile.intrested_in_id;
        let posterPracticeAreaIds = posterBasicProfile.practice_area_id;
        let posterPracticeLocationIds = posterBasicProfile.practice_location_id;

        let states = listsObj.states;
        let degrees = listsObj.degrees;
        let skills = listsObj.skills;
        let employment_types = listsObj.employment_types;
        let practices = listsObj.practice_areas;
        let work_locations = listsObj.work_locations;
        let categories = listsObj.categories;

        let posterState = that.getFilterData(states, posterStateId);
        let posterStateName = '';
        if (posterState.length > 0) {
            posterStateName = posterState[0].name;
        }

        let practiceAreas = [];
        for (let i = 0; i < posterPracticeAreaIds.length; i++) {
            let practiceArea = that.getFilterData(practices, posterPracticeAreaIds[i]);
            if (practiceArea.length) {
                practiceAreas.push(practiceArea[0].name);
            }
        }

        let practiceLocations = [];
        for (let i = 0; i < posterPracticeLocationIds.length; i++) {
            let practiceLocation = that.getFilterData(states, posterPracticeLocationIds[i]);
            if (practiceLocation.length) {
                practiceLocations.push(practiceLocation[0].name);
            }
        }

        let intrestedIns = [];
        for (let i = 0; i < posterIntrestedInIds.length; i++) {
            let posterIntrestedIn = that.getFilterData(categories, posterIntrestedInIds[i]);
            if (posterIntrestedIn.length) {
                intrestedIns.push(posterIntrestedIn[0].name);
            }
        }

        let obj = {
            posterData: posterData,
            posterState: posterStateName,
            posterPracticeAreas: practiceAreas,
            posterPracticeLocations: practiceLocations,
            posterInterestedIns: intrestedIns
        }
        that.setStateObj(obj);
    }

    setUserRelatedData(userObj) {
        let that = this;
        utils.apiCall('GET_ALL_LISTS', {}, function (err, response) {
            if (err) {
                utils.flashMsg('show', 'Error while getting Dropdown Data');
                utils.logger('error', 'Get All List Error -->', err);
            } else {
                if (utils.isResSuccess(response)) {
                    let data = utils.getDataFromRes(response);
                    that.setSeekerData(userObj, data);
                    that.setPosterData(userObj, data);
                } else {
                    utils.flashMsg('show', utils.getServerErrorMsg(response));
                }
            }
        });
    }

    profileImgError(evt) {
        return utils.onImgError(evt, '/images/default-profile-pic.png');
    }

    viewWritingSamples() {
        let _that = this;
        let popupType = constant['POPUP_TYPES']['VIEW_FILE'];
        _that.setState({
            modalPopupObj: {
                type: popupType,
                writingSamples: _that.state.writingSamples,
                noBtnAction: function () {
                    utils.modalPopup(popupType, 'hide', _that)
                }
            }
        }, function () {
            utils.modalPopup(popupType, 'show', self);
        });
    }

    componentDidMount() {
        this.setTabPanel(this.state.initialLoadedSection);
        this.getUserProfile();
    }

    componentDidUpdate(nextProps) {
        let oldSection = nextProps.params.section;
        let newSection = this.props.params.section;
        if (oldSection !== newSection && !((oldSection === 'attorney' || oldSection === 'firm') && !this.isOtherProfile())) {
            this.getUserProfile();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setTabPanel(nextProps.params.section);
    }

    setTabPanel(section) {
        let currentTabText;
        if (section === 'firm') {
            $('[href="#panel2"]').tab('show');
            currentTabText = 'Firm Profile';
        } else if (section === 'attorney') {
            $('[href="#panel1"]').tab('show');
            currentTabText = 'Attorney Profile';
        }

        let obj = {
            initialLoadedSection: section,
            currentTab: currentTabText
        }
        this.setStateObj(obj);
    }

    moveToEditProfilePage() {
        let routesPath = constant['ROUTES_PATH'];
        let path = routesPath['SEEKER_BASIC_INFO'];
        if (this.isFirmProfile()) {
            path = routesPath['POSTER_BASIC_INFO'];
        }
        utils.changeUrl(path);
    }

    getFormatedAddress(obj, state) {
        let address = [];
        if (obj.street_address) {
            address.push(obj.street_address);
        }
        if (obj.city) {
            address.push(obj.city);
        }
        if (state) {
            address.push(state);
        }
        if (obj.zipcode) {
            address.push(obj.zipcode);
        }
        return address.join(', ');
    }

    isAttorneyProfile() {
        return this.state.initialLoadedSection === 'attorney';
    }

    isFirmProfile() {
        return this.state.initialLoadedSection === 'firm';
    }

    isOtherProfile() {
        return !(this.isAttorneyProfile() || this.isFirmProfile());
    }

    isCandidate() {
        const locationState = this.props.location.state

        return locationState && locationState.isCandidate
    }

    jobDetailLinkToObj() {
        let jobId = (this.props.location.state !== null ? this.props.location.state.jobId : '')
        let path = constant['ROUTES_PATH']['MY_POSTED_JOBS'] + (jobId ? ('/' + jobId) : '');
        return {
            pathname: path,
            state: {
                fromRoute: 'POSTED_JOBS'
            }
        }
    }

    render() {
        let routesPath = constant['ROUTES_PATH'];
        let writingSamples = this.state.writingSamples;
        let seekerData = this.state.seekerData;
        let posterData = this.state.posterData;
        let seekerEducations = this.state.seekerEducations;
        let seekerJobProfile = this.state.seekerJobProfile;
        let desiredWillingToWork = [];
        if (seekerJobProfile) {
            {/*if(seekerJobProfile.willing_to_work_locally == 'Y') {
        locationWillingToWork.push('Willing to work locally');
      }*/
            }
            seekerJobProfile.locationWillingToWork = '';
            if (seekerJobProfile.willing_to_work_remotely == 'Y') {
                seekerJobProfile.locationWillingToWork = 'Willing to work remotely';
            }
            if (seekerJobProfile.willing_to_work_full_time == 'Y') {
                desiredWillingToWork.push('Willing to work full time');
            }
            if (seekerJobProfile.willing_to_work_part_time == 'Y') {
                desiredWillingToWork.push('Willing to work part time');
            }
            seekerJobProfile.desiredWillingToWork = desiredWillingToWork.join(', ');
        }

        let seekerAddress = '';
        if (seekerData) {
            seekerAddress = this.getFormatedAddress(seekerData, this.state.seekerState);
        }

        let posterAddress = '';
        if (posterData) {
            posterAddress = this.getFormatedAddress(posterData, this.state.posterState);
        }

        var attorneyProfileTabClass = classNames({
            'nav-item': true,
            'active': this.isAttorneyProfile()
        });


        var firmProfileTabClass = classNames({
            'nav-item': true,
            'active': this.isFirmProfile()
        });

        var attorneyProfileMainTabClass = classNames({
            'tab-pane': true,
            'active': this.isAttorneyProfile() || this.isOtherProfile(),
            'fade': this.isFirmProfile()
        });


        var firmProfileMainTabClass = classNames({
            'tab-pane': true,
            'active': this.isFirmProfile(),
            'fade': this.isAttorneyProfile()
        });

        return (
            <Dashboard>
                <section
                    className={this.isOtherProfile() ? 'view-profile-wrapper sidebar-margin' : 'view-profile-wrapper ml-auto mr-auto'}
                    ref="profileRef">
                    <div className="section-head">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">{this.isOtherProfile() ? 'Dashboard | Job Posting' : 'Profile'}</li>
                            {
                                this.isOtherProfile()
                                    ?
                                    <p>
                                        {
                                            this.isCandidate()
                                                ?
                                                <Link to={routesPath['CANDIDATE_SEARCH']}>Candidate Search</Link>
                                                :
                                                <span>
                            <Link to={routesPath['MY_POSTED_JOBS']}>My Jobs</Link>
                            <i className="fa fa-angle-right mr-15 ml-15" aria-hidden="true"></i>
                            <Link to={this.jobDetailLinkToObj()}>Job Detail</Link>
                          </span>
                                        }
                                        <i className="fa fa-angle-right mr-15 ml-15"
                                           aria-hidden="true"></i>{this.state.firstName} {this.state.lastName}
                                    </p>
                                    :
                                    null
                            }
                        </ol>
                        {
                            this.isOtherProfile() ?
                                null
                                :
                                <button type="button" className="btn edit-profile-btn"
                                        onClick={() => this.moveToEditProfilePage()}>
                                    <a>
                                        <i className="fa fa-pencil" aria-hidden="true"></i>Edit Profile
                                    </a>
                                </button>
                        }
                    </div>
                    {/* section-head ends*/}
                    {this.state.isResponse ?
                        (
                            <div className="tab-wrapper">
                                {
                                    this.isOtherProfile() ?
                                        null
                                        :
                                        <ul className="nav nav-justified">
                                            <li className={attorneyProfileTabClass}>
                                                <a className="nav-link" id="attorneyPorfile" data-toggle="tab"
                                                   href="#panel1" role="tab" onClick={(e) => this.changeTab(e)}>Attorney
                                                    Profile</a>
                                            </li>
                                            <li className={firmProfileTabClass}>
                                                <a className="nav-link" id="firmPorfile" data-toggle="tab"
                                                   href="#panel2" role="tab" onClick={(e) => this.changeTab(e)}>Firm
                                                    Profile</a>
                                            </li>
                                        </ul>
                                }

                                {/*<!-- Tab panels -->*/}
                                <div className="tab-content">

                                    {seekerData ?

                                        <div className={attorneyProfileMainTabClass} id="panel1" role="tabpanel">

                                            <div className="basic-info-preview">
                                                <figure className="pull-left">
                                                    <img src={this.state.seekerProfileImage}
                                                         onError={this.profileImgError}/>
                                                </figure>

                                                <div className="basic-info-content pull-left">
                                                    <h3>{this.state.firstName} {this.state.lastName}</h3>
                                                    <h6>
                                                        {seekerData ? seekerData.network.lawyer_headline : ''}</h6>
                                                    <address>
                                                        <i className="fa fa-map-pin"
                                                           aria-hidden="true"></i>{seekerAddress}</address>
                                                    <address>
                                                        <i className="fa fa-phone"
                                                           aria-hidden="true"></i>{seekerData.basic_profile.basic_info.phone_number}
                                                    </address>
                                                    <Link
                                                        to={seekerData.network.linkedin_link ? (!seekerData.network.linkedin_link.includes('http') && '//' + seekerData.network.linkedin_link) : null}
                                                        target="_blank">
                                                        <i className="fa fa-linkedin"
                                                           aria-hidden="true"></i>{seekerData.network.linkedin_link ? seekerData.network.linkedin_link : ''}
                                                    </Link>
                                                </div>
                                                <span className="clearfix"></span>

                                            </div>


                                            <div className="about-lawyer-preview align-items-center">
                                                <h5 className="pull-left">
                                                    About Lawyer
                                                </h5>
                                                <div className="pull-left left-content">
                                                    <p>{seekerData.network.about_lawyer}
                                                    </p>
                                                </div>
                                                <span className="clearfix"></span>
                                            </div>
                                            {/*about-lawyer-preview ends here*/}


                                            <div className="education-preview align-items-center">
                                                <h5 className="pull-left">
                                                    Education
                                                </h5>
                                                <div className="pull-left left-content">


                                                    {

                                                        this.state.seekerEducations.map((seekerEducation, index) => {

                                                            return <div key={index}
                                                                        className={(index > 0 ? 'mt-30' : '')}>
                                                                <h4>{seekerEducation.degree}</h4>
                                                                <h6>{seekerEducation.school}, {seekerEducation.year}</h6>
                                                                {seekerEducation.education_additional_information ?
                                                                    <p>{seekerEducation.education_additional_information}</p>
                                                                    : ''
                                                                }
                                                            </div>

                                                        })

                                                    }
                                                </div>
                                                <span className="clearfix"></span>
                                            </div>


                                            {/*education-preview ends here*/}


                                            <div className="licensure-preview align-items-center">
                                                <h5 className="pull-left">
                                                    State Licensure
                                                </h5>
                                                <div className="pull-left left-content">


                                                    {

                                                        this.state.seekerBarAdmission.map((barAdmission, index) => {

                                                            return <p key={index}>
                                                                <span>{barAdmission.bar_state_name}, {barAdmission.bar_registration_number}</span>
                                                            </p>

                                                        })

                                                    }
                                                </div>
                                                <span className="clearfix"></span>
                                            </div>


                                            {/*licensure-preview ends here*/}


                                            <div className="skills-preview">
                                                <h5 className="pull-left">
                                                    Skills
                                                </h5>
                                                <div className="pull-left left-content">


                                                    <div>
                                                        <h6 className="mr-15 d-inline-block">Practice Areas</h6>

                                                        {

                                                            this.state.seekerPracticeAreas.map((seekerPracticeArea, index) => {

                                                                return <span key={index}
                                                                             className="badge">{seekerPracticeArea}</span>

                                                            })

                                                        }

                                                    </div>


                                                    <div>
                                                        <h6 className="mr-15 d-inline-block">Skills</h6>

                                                        {

                                                            this.state.seekerSkills.map((seekerSkill, index) => {

                                                                return <span key={index}
                                                                             className="badge">{seekerSkill}</span>

                                                            })

                                                        }

                                                    </div>


                                                </div>
                                                <span className="clearfix"></span>
                                            </div>

                                            <div className="experience-preview">
                                                <h5 className="pull-left">
                                                    Experience
                                                </h5>
                                                <div className="pull-left left-content">
                                                    {
                                                        this.state.seekerExperiences.map((seekerExperience, index) => {

                                                            return <div key={index}
                                                                        className={(index > 0 ? 'mt-30' : '')}>
                                                                {

                                                                    seekerExperience.employment_types.map((employmentType, employmentTypeIndex) => {

                                                                        return <span key={employmentTypeIndex}
                                                                                     className="badge">{employmentType}</span>

                                                                    })

                                                                }
                                                                <h4>{seekerExperience.company_name}</h4>
                                                                <h6>{seekerExperience.designation ? seekerExperience.start_date ? seekerExperience.designation + ', ' : seekerExperience.designation : ''} {seekerExperience.start_date ? (this.getMonth(seekerExperience.start_date) + ', ' + this.getFullYear(seekerExperience.start_date)) : ''} {(seekerExperience.start_date && seekerExperience.present === 'Y') ? ' - Present' : seekerExperience.end_date ? (' - ' + this.getMonth(seekerExperience.end_date) + ', ' + this.getFullYear(seekerExperience.end_date)) : ''}</h6>
                                                                <p>{seekerExperience.experience_additional_information}</p>
                                                                {seekerExperience.skill_used.length ?

                                                                    <p><span>Skills Used</span>: {
                                                                        seekerExperience.skill_used.join(', ')
                                                                    }
                                                                    </p>

                                                                    : ''}
                                                            </div>
                                                        })
                                                    }

                                                </div>
                                                <span className="clearfix"></span>
                                            </div>

                                            <div className="job-type-preview">
                                                <h5 className="pull-left">
                                                    Job Type
                                                </h5>
                                                <div className="pull-left left-content">
                                                    <div>
                                                        <h4>Location</h4>
                                                        {this.state.seekerJobProfile.willing_to_work_location_id.length > 0 ?
                                                            <h6 className="d-inline-block">Willing to work in</h6>
                                                            :
                                                            ''
                                                        }
                                                        {this.state.seekerJobProfile.willing_to_work_location_id.map((workLocation, workLocationIndex) => {
                                                            return <span key={workLocationIndex}
                                                                         className="badge">{workLocation}</span>
                                                        })
                                                        }
                                                        <h6>{seekerJobProfile.locationWillingToWork}</h6>
                                                    </div>
                                                    <h4 className="mt-30">Desired hours</h4>
                                                    <h6>{seekerJobProfile.desiredWillingToWork}</h6>
                                                    <div>
                                                        <h4 className="mt-30">Desire Job Type and Compensation</h4>
                                                        {this.state.seekerJobProfile.desired_job_type.map((desiredJobType, desiredJobTypeIndex) => {
                                                            return desiredJobType.selected === 'Y' ? (
                                                                <h6 key={desiredJobTypeIndex}>{desiredJobType.employment_type} ({desiredJobType.employment_type.toLowerCase() === 'permanent' ? 'Salaried' : 'Hourly Rate'}) {desiredJobType.min_amount == desiredJobType.max_amount ? `$${desiredJobType.max_amount}` : `$${desiredJobType.min_amount} - $${desiredJobType.max_amount}`}</h6>) : null
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                                <span className="clearfix"></span>
                                            </div>
                                            <div className="mt-30 text-right">
                                                {this.state.resume ?
                                                    <a href={this.state.resumeUrl}>
                                                        <button type="button" className="btn btn-primary">
                                                            View Resume
                                                        </button>
                                                    </a>
                                                    : ''}
                                                {writingSamples.length > 0 ?
                                                    <button type="button" className="btn btn-primary"
                                                            onClick={(e) => this.viewWritingSamples()}>
                                                        View Writing Samples
                                                    </button>
                                                    : ''}
                                            </div>
                                        </div>
                                        : ''

                                    }

                                    {/*<!--/.Panel 1-->*/}

                                    {/*<!--Panel 2-->*/}

                                    {

                                        posterData ?


                                            <div className={firmProfileMainTabClass} id="panel2" role="tabpanel">

                                                <div className="poster-info-preview">
                                                    <div className="poster-info-content">
                                                        <h3>{this.state.firstName} {this.state.lastName}</h3>
                                                        <address>
                                                            <i className="fa fa-map-pin"
                                                               aria-hidden="true"></i>{posterAddress}
                                                        </address>
                                                        <address>
                                                            <i className="fa fa-phone"
                                                               aria-hidden="true"></i>{posterData.basic_profile.basic_info.phone_number}
                                                        </address>
                                                        <address>
                                                            <i className="fa fa-globe"
                                                               aria-hidden="true"></i>{posterData.basic_profile.website_url}
                                                        </address>
                                                    </div>
                                                    <span className="clearfix"></span>
                                                </div>

                                                <div className="poster-conclusion-preview">
                                                    <div className="pull-left left-content pl-0">
                                                        <h4>{posterData.basic_profile.firm_name}</h4>
                                                        <h6>{posterData.basic_profile.title}</h6>
                                                        <div>
                                                            <h6 className="mr-15 d-inline-block">Practice
                                                                Location(s)</h6>
                                                            {this.state.posterPracticeLocations.map((posterPracticeLocation, posterPracticeLocationIndex) => {
                                                                return <span key={posterPracticeLocationIndex}
                                                                             className="badge">{posterPracticeLocation}</span>
                                                            })
                                                            }
                                                        </div>

                                                        <div>
                                                            <h6 className="mr-15 d-inline-block">Practice Area(s)</h6>
                                                            {this.state.posterPracticeAreas.map((posterPracticeArea, posterPracticeAreaIndex) => {
                                                                return <span key={posterPracticeAreaIndex}
                                                                             className="badge">{posterPracticeArea}</span>
                                                            })
                                                            }
                                                        </div>
                                                        <div>
                                                            <h6 className="mr-15 d-inline-block">Interested in Hiring
                                                                (Now or in the future)</h6>
                                                            {this.state.posterInterestedIns.map((posterInterestedIn, posterInterestedInIndex) => {
                                                                return <span key={posterInterestedInIndex}
                                                                             className="badge">{posterInterestedIn}</span>
                                                            })
                                                            }
                                                        </div>
                                                    </div>
                                                    <span className="clearfix"></span>
                                                </div>
                                            </div>
                                            :
                                            ''
                                    }
                                </div>
                            </div>
                        )
                        :
                        null
                    }
                    <ModalPopup modalPopupObj={this.state.modalPopupObj}/>
                </section>
                <span className="clearfix"></span>
            </Dashboard>
        );
    }
}
