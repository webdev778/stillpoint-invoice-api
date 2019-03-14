var rfr = require('rfr'),
Mongoose = require('mongoose');

var config = rfr('/server/shared/config'),
utils = rfr('/server/shared/utils');

(function() {
  var dbObj = config['database'];
  Mongoose.connect('mongodb://' + dbObj['username'] + ':' + dbObj['password'] + '@' + dbObj['host'] + ':' + dbObj['port'] + '/' + dbObj['db']);

  var con = Mongoose.connection;
  con.once('open', function() {
    utils.log('Connection with database succeeded');
    rfr('/server/schemas/dml/index');
  });
  con.on('error', function(err) {
    utils.log('Connection Error -->', err);
    utils.writeErrorLog('index', 'IIFE', 'Error while connecting to database', err);
  });
}());
