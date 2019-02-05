require('babel-register')({
    presets: ['react', 'es2015']
});

var express = require('express'),
    Db = require('./server/config/db'),
    config = require('./server/config/config');
var bodyParser = require('body-parser');
require('./server/model/index');

var app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(bodyParser.json({limit: '500mb'}));


//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});


app.use(express.static('public'));
app.use(require('./server/routes/index.jsx'));

var PORT = config.server.port;
app.listen(PORT, function() {
    console.log('http://localhost:' + PORT);
});
