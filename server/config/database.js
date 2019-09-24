const fs = require('fs');

dotenv = require('dotenv'),
dotenvParseVariables = require('dotenv-parse-variables');

var env = dotenv.config({path: '.env'}),
parsedEnv = dotenvParseVariables(env.parsed);

module.exports = {
  development: {
    username: parsedEnv.DB_USER,
    password: parsedEnv.DB_PASS,
    database: parsedEnv.DB_NAME,
    host: parsedEnv.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false
  },
  test: {
    username: parsedEnv.DB_USER,
    password: parsedEnv.DB_PASS,
    database: parsedEnv.DB_NAME,
    host: parsedEnv.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false
  },
  staging: {
    username: parsedEnv.DB_USER,
    password: parsedEnv.DB_PASS,
    database: parsedEnv.DB_NAME,
    host: parsedEnv.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false
  },
  production: {
    username: parsedEnv.DB_USER,
    password: parsedEnv.DB_PASS,
    database: parsedEnv.DB_NAME,
    host: parsedEnv.DB_HOST,
    dialect: 'postgres',
    operatorsAliases: false
  }
};
