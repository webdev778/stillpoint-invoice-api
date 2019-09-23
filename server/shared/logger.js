const winston = require('winston');
const fs = require('fs');
require('winston-daily-rotate-file');

const logDir = 'server/logs';

// Create the `logs` directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const transport = new (winston.transports.DailyRotateFile)({
  filename: 'stillpoint-invoice-%DATE%.log',
  dirname: `${logDir}`,
  datePattern: 'DDMMMYYYY',
  maxFiles: '90d'
});

transport.on('rotate', function(oldFilename, newFilename) {
  // do something
});

const logger = winston.createLogger({
  transports: [transport,
    new winston.transports.Console()]
});

module.exports = logger;
