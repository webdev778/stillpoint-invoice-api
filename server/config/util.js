var ES6Promise = require("es6-promise");
ES6Promise.polyfill();
import axios from 'axios';
import { Link, browserHistory } from 'react-router';
import Util from '../../common/Util.js';
import CONST from '../../common/Const.js';

export function ApiCall(method, api, data, token, callback) {

	 axios({
      method: method,

       // url: 'http://localhost:3000'+api,

       // url: 'https://legablystage.kiwitechopensource.com'+api,
        url : 'https://www.legably.com' + api,


      // url: 'http://legablydev.kiwitechopensource.com'+api,

      data: data,
      headers : {
        'token': token
      }
    })
    .then(function (response) {
      console.log(response);
      if(response.data.Message == CONST.AUTH_FAIL){
        Util.rememberMeFunc();
      }else{
        callback(null,response)
      }
    })
  .catch(err => {
    callback(err)
  });

}

