var rfr = require('rfr'),
Mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

var config = rfr('/server/shared/config'),
utils = rfr('/server/shared/utils');

const db={};

(function() {
  var env = config['env'] || process.env.NODE_ENV;
  var dbObj = config['database'];

  // mongo database
  /*
  if (env !== 'development' || dbObj.username) {
    Mongoose.connect('mongodb://' + dbObj['username'] + ':' + dbObj['password'] + '@' + dbObj['host'] + ':' + dbObj['port'] + '/' + dbObj['db']);
  } else {
    Mongoose.connect('mongodb://' + dbObj['host'] + ':' + dbObj['port'] + '/' + dbObj['db']);
  }

  var con = Mongoose.connection;
  con.once('open', function() {
    utils.log('Connection with database succeeded');
    rfr('/server/schemas/dml/index');
  });
  con.on('error', function(err) {
    utils.log('Connection Error -->', err);
    utils.writeErrorLog('index', 'IIFE', 'Error while connecting to database', err);
  });
  */

  // postgres db
  const sequelize = new Sequelize('postgres://postgres:123123@10.10.10.194:5432/d7bjegrmpo9e7k');

  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const model_path = __dirname+'../pg_models/';
  fs.readdirSync(model_path).filter(file => {
    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
  }).forEach(file => {
    const model = sequelize['import'](path.join(model_path, file));
    db[model.name] = model;
  });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  module.exports = db;
}());