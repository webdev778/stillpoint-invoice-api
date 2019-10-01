var rfr = require('rfr');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = rfr('/server/shared/config'),
utils = rfr('/server/shared/utils');

const pg = require('pg');

const db={};

(function() {
  var env = config['env'] || process.env.NODE_ENV;
  var dbObj = config['database'];

  // mongo database
/*
  Mongoose.connect('mongodb://localhost:27017/legably-dev');

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
  if(config.env != "development")
    pg.defaults.ssl = true;

  // transaction
  const cls = require('continuation-local-storage');
  const namespace = cls.createNamespace('stillpoint-invoice-api');
  Sequelize.useCLS(namespace);

  const sequelize = new Sequelize(
    config.database.db,
    config.database.username,
    config.database.password, {
        host: config.database.host,
        dialect: 'postgres',
        omitNull: true,
        define: {
            underscored: true
        }
    }
  );

  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const model_path = __dirname+'/schema/';
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