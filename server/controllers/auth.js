var rfr = require('rfr');

var utils = rfr('/server/shared/utils');

const login = (req, res) => {
  const result = {
    id: 9999,
    firstName: 'Aaron',
    lastName: 'Balick',
    isCounsellor: true,
  };

  utils.sendResponse(res, result);
}

module.exports = {
  login
}
