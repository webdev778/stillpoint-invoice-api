import React from 'react';
import {
    Router,
    Route,
    IndexRoute,
    browserHistory
} from 'react-router';

import Layout from '../../views/Layout.jsx';
import Signin from '../../views/Signin.jsx';
import Signup from '../../views/Signup.jsx';
import ThankYou from '../../views/Thankyou.jsx';
import ForgotPassword from '../../views/ForgotPassword.jsx';
import ResetPassword from '../../views/ResetPassword.jsx';
import ResetLink from '../../views/ResetLink.jsx';
import ProBasicInfo from '../../views/proBasicInfo.jsx';
import ChangePassword from '../../views/ChangePassword.jsx';
import ProExperience from '../../views/sign-up-experience.jsx';
import NetworkProfile from '../../views/networkProfile.jsx';
import JobProfile from '../../views/jobProfile.jsx';
import SuccessChangePassword from '../../views/successChangePassword.jsx';
import EnsureLoggedInContainer from '../../views/ensureLoggedIn.jsx';
import EnsureNonLoggedInContainer from '../../views/ensureNonLoggedIn.jsx';
import Homepage from '../../views/homepage.jsx';

import ContactUs from '../../views/contactUs.jsx';
import FaqContainer from '../../views/faq.jsx';
import PrivacyPolicy from '../../views/privacyPolicy.jsx';
import TermOfService from '../../views/TermOfService.jsx';
import AboutUs from '../../views/aboutUs.jsx';
import NotFound from '../../views/notFound.jsx';
import SeekerThankYou from '../../views/seekerGetStarted.jsx';
import PosterThankYou from '../../views/posterThankYou.jsx';
import PostJob from '../../views/postJob.jsx';
import BasicInfoPoster from '../../views/basicInfoPoster.jsx';
import PreviewJob from '../../views/PreviewJob.jsx';
import JobList from '../../views/JobList.jsx';
import AdminDashboard from '../../views/AdminDashboard.jsx';

module.exports = (
    <Router history={browserHistory}>
        <Route path="/" component={Layout}>
            <Route path="/frequently-asked-questions" component={FaqContainer} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
             <Route path="/terms-of-service" component={TermOfService} />
            <Route path="/support-center" component={ContactUs} />
            <Route path="/company-overview" component={AboutUs} />

            <Route component={EnsureNonLoggedInContainer}>
                <IndexRoute component={Homepage} />
                <Route path="/sign-up" component={Signup} />
                <Route path="/sign-in" component={Signin} />
                <Route path="/forgotPassword" component={ForgotPassword} />
                <Route path="/resetLink" component={ResetLink} />
                <Route path="/resetPassword/:secretId" component={ResetPassword} />
                <Route path="/successChangePassword" component={SuccessChangePassword} />
            </Route>
            <Route component={EnsureLoggedInContainer}>
                <Route path="/thankyou" component={ThankYou} />
                <Route path="/attorney-profile-basic-info" component={ProBasicInfo} />
                <Route path="/attorney-profile-experience" component={ProExperience} />
                <Route path="/attorney-profile-headline" component={NetworkProfile} />
                <Route path="/attorney-profile-job-type" component={JobProfile} />
                <Route path="/changePassword" component={ChangePassword} />
                <Route path="/attorney-profile-get-started" component={SeekerThankYou} />
                <Route path="/post-job-details" component={PostJob} />
                <Route path="/previewJob" component={PreviewJob} />
                <Route path="/jobList" component={JobList} />
                <Route path="/post-job-thank-you" component={PosterThankYou} />
                <Route path="/post-job-basic-information" component={BasicInfoPoster} />
                <Route path="/admin-dashboard" component={AdminDashboard} />
                <Route path="*" component={NotFound} />

            </Route>

        </Route>
    </Router>
);


