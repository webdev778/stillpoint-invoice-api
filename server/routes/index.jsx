var router = require('express').Router();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ReactRouter = require('react-router');
var Redux = require('redux');
var Provider = require('react-redux').Provider;
var user = require('../controller/user');
var userProfile = require('../controller/userProfile');
var commonMethod = require('../controller/commonMethod');
var login = require('../controller/login');
var postJob = require('../controller/postJob');
var contactUs = require('../controller/contact_us');
var admin = require('../controller/admin');
var useragent = require('useragent');

function reducer(state) { return state; }

router.route('/getUserProfile/:forUser/:fromUser')
    .get(userProfile.getUserProfile);

router.route('/getState')
    .get(commonMethod.getDropdownList('state'));

router.route('/getPracticeArea')
    .get(commonMethod.getDropdownList('practice_area'));

router.route('/getDegree')
    .get(commonMethod.getDropdownList('degree'));

router.route('/getEmploymentType')
    .get(commonMethod.getDropdownList('employment_type'));

router.route('/getSkills')
    .get(commonMethod.getDropdownList('skills'));

router.route('/getSettings')
    .get(commonMethod.getDropdownList('setting'));

router.route('/getInterestedInHiring')
    .get(commonMethod.getDropdownList('interested_in_hiring'));

router.route('/getCurrentRate')
    .get(commonMethod.getCurrentRate());

router.route('/getPostJob/:jobId')
    .get(postJob.getPostJobData);

router.route('/getEstHourType')
    .get(commonMethod.getEstHourType());

router.route('/exportUsers')
    .get(admin.exportUsers);

router.route('/exportPostJobs')
    .get(admin.exportPostJobs);

router.get('*', function(request, response) {
    var initialState = { title: 'Legably' };
    var store = Redux.createStore(reducer, initialState);

    ReactRouter.match({
        routes: require('./routes.jsx'),
        location: request.url
    }, function(error, redirectLocation, renderProps) {
        if (renderProps) {
            //console.log("renderProps : ",renderProps);
            var html = ReactDOMServer.renderToString(
                <Provider store={store}>
                    <ReactRouter.RouterContext {...renderProps} />
                </Provider>
            );
            var userAgent = request.headers['user-agent'];
            var agent = useragent.is(userAgent);
            if (( !agent.firefox && !agent.chrome && !agent.safari ) || ( userAgent.indexOf("Edge") > -1 )) {
                html = html.replace(/<\/body>/g,'<div class=\"alert-success ie-alert\"><div class=\"text-center\"><span><i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i></span> For the best experience, please use Legably in Google Chrome or Mozilla Firefox or Safari.</div><div class=\"close-alert\" onClick=\"$(\'.ie-alert\').addClass(\'hide-ie-alert\')\">x</div></div></body>');
            }
            response.send(html);
        } else {
            response.status(404).send('Not Found');
        }
    });
});


router.route('/signup')
    .post(user.signupUser);

router.route('/forgotPassword')
    .post(user.forgotPass);

router.route('/checkResetLink/:secretId')
    .post(user.checkResetLink);

router.route('/resetPassword/:secretId')
    .post(user.resetPass);

router.route('/login')
  .post(login.loginUser);

router.route('/changePassword')
    .post(user.changePassword);

router.route('/userBasicProfile')
    .post(userProfile.basicProfile);

router.route('/userExperienceProfile')
    .post(userProfile.experienceProfile);

router.route('/userNetworkProfile')
    .post(userProfile.networkProfile);

router.route('/userJobProfile')
    .post(userProfile.jobProfile);

router.route('/logout')
    .post(login.logout);

router.route('/contactus')
   .post(contactUs.contactUs);

router.route('/posterBasicProfile')
    .post(userProfile.posterBasicProfile);

router.route('/postJob')
   .post(postJob.postJobData);

module.exports = router;
