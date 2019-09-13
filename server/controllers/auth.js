var rfr = require('rfr');

var utils = rfr('/server/shared/utils');

const login = (req, res) => {

   const userId = req.params.id;
  // const counselorId = 203;

  let result;
  if (userId == 1){
    result = {
      id: 203,
      firstName: 'Anthony',
      lastName: 'Maki',
      isCounsellor: true,
    };
  }else{
    result = {
      id: 1332,
      firstName: 'Linda',
      lastName: 'Smith',
      isCounsellor: false,
    };
  }


  utils.sendResponse(res, result);
}

module.exports = {
  login
}
