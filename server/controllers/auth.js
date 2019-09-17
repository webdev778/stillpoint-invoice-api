var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var clientModel = rfr('/server/models/client');
var counselorModel = rfr('/server/models/counselor');

const loginMockup = (req, res) => {

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

const login = (req, res) => {
  const { userInfo } = req;

  if(!userInfo)
    return res.status(401);

  res.send(userInfo);
}

const ping = (req, res) => {
  const { userInfo } = req;

  if(!userInfo)
    return res.status(401);

  res.send(userInfo);
}


//middle ware
const UserParser = async (req, res, next) => {
  const { user } = req;

  if(!user)
    return res.status(401);

  const id = user.sub.split('|')[1];

  try{
    const client = await clientModel.findById(id);

    if(!client){
      throw 'User not found';
    }

    let userInfo = {
      id: parseInt(id),     // Todo check
      firstName: client.firstName,
      lastName: client.lastName,
      isCounsellor: !!client.Counselor,
      counselorId: !!client && client.Counselor.id
    };

    req.userInfo = userInfo;
    console.log('*************************<User Info>**************************', JSON.stringify(userInfo));
  }catch(e){
    console.log(e);
    utils.writeErrorLog('auth', 'userInfo', 'Error while getting user info', e, {id});
    req.userInfo = null;
  }
  return next();
}


module.exports = {
  UserParser,
  login,
  ping
}
