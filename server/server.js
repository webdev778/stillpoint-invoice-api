require('babel-register')({
  presets: ['react', 'es2015']
});

var rfr = require('rfr'),
  express = require('express'),
  http = require('http'),
  bodyParser = require('body-parser');

const db = rfr('/server/db/index');
rfr('/server/schemas/ddl/index');

var config = rfr('/server/shared/config'),
  utils = rfr('/server/shared/utils'),
  routes = rfr('/server/routes');

// initialize our application
function start() {
  var app = express();

  const jwt = require("express-jwt");
  const jwksRsa = require("jwks-rsa");

  // Set up Auth0 configuration
  const authConfig = {
    "domain": "webdev778.auth0.com",
    "clientId": "muogQcXDLufn09vuhPlhgphhduRFH2Tf",
    "audience": "https://culturecurator.co.uk/"
  };

  const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
    }),

    audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithm: ["RS256"]
  });

  app.get("/api/external", checkJwt, (req, res) => {
    res.send({
      msg: "Invoice App, Your Access Token was successfully validated!"
    });
  });


  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use(bodyParser.json({ limit: '500mb' })); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" })); // support encoded bodies

  //To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  // app.use(express.static('./client/src/assets'));
  // app.use(express.static('./client/dist'));

  app.set('json replacer', (k, v) => (v === null ? undefined : v)); //json omit null values

  var PORT = config['server']['port'];
  http.createServer(app).listen(PORT, function () {
    utils.log('Server started successfully on port -->', PORT);
    routes.bindAllRequests(app);
    // app.use(rfr('/server/universalRoute.jsx'));
  });
}

module.exports.start = start;
