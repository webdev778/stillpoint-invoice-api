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
    return utils.sendResponse(res, {Code: 401, Message: 'Unauthorized'});

  res.send(userInfo);
}

const ping = (req, res) => {
  const { userInfo } = req;

  if(!userInfo)
    return utils.sendResponse(res, {Code: 401, Message: 'Unauthorized'});

  res.send(userInfo);
}


//middle ware
const UserParser = async (req, res, next) => {
  const { user } = req;

  if(!user)
    return utils.sendResponse(res, {Code: 401, Message: 'Unauthorized'});

  const id = user.sub.split('|')[1];

  try{
    if(isNaN(id)){
      throw 'invalid user id';
    }

    const client = await clientModel.findById(id);

    if(!client){
      throw 'User not found';
    }

    let userInfo = {
      id: client.id,     // Todo check
      firstName: client.firstName,
      lastName: client.lastName,
      isCounsellor: !!client.Counselor,
      counselorId: !!client.Counselor ? client.Counselor.id : null,
      isStripeConnected: !!client.Counselor ? !!client.Counselor.StripeConnect : null
    };

    req.userInfo = userInfo;
    console.log('*************************<User Info>**************************', JSON.stringify(userInfo));
    logger.info('[auth] | <UserParser> - parsed auth0 token,', JSON.stringify(userInfo));
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
