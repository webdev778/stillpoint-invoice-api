var rfr = require('rfr');

var utils = rfr('/server/shared/utils');

const login = (req, res) => {

  // const userId = 11;
  // const counselorId = 203;

  const result = {
    id: 203,
    firstName: 'Anthony',
    lastName: 'Maki',
    isCounsellor: true,
  };

  utils.sendResponse(res, result);
}

module.exports = {
  login
}
