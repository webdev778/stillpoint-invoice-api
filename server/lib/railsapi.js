const axios = require('axios');
const moment = require('moment');
const rfr = require('rfr');
const config = rfr('/server/shared/config');
const constant = rfr('/server/shared/constant');

let _accessToken = null;

const getToken = async () => {
  const postData = {
    "client_id": config.auth0.nodeClientId,
    "client_secret": config.auth0.nodeClientSecretKey,
    "audience": config.auth0.railsApi,
    "grant_type": "client_credentials"
  };
  const { data: { access_token: ret } } = await axios.post(`https://${config.auth0.domainRails}/oauth/token`, postData);

  console.log('Successfully received access_token token=', ret);

  _accessToken = ret;
  return ret;
}


const sendMessage = async (invoice) => {
  let accessToken = _accessToken;

  if(!accessToken){
    accessToken = await getToken();
    //throw Error('accessToken is null');
  }
  if(!invoice) throw Error('invoice is null');

  const msg = {
    "counselor_id": invoice.counselorId,
    "user_id" : invoice.clientId,
    "content" : _templateHtml(invoice)
  };

  const resp = await axios.post(`${config.railsApiUrl}/message/`, msg, { headers: {
    'Authorization': `bearer ${accessToken}`
  }});

  console.log('successfully sent', resp.data);
}

const _templateHtml = (invoice) => {

  let htmlStr = '';

  const invoiceUrl = `${config.reactUrl}/invoice/${invoice.id}`
  let senderName = '';
  if(invoice.Counselor.User.firstName)
    senderName = invoice.Counselor.User.firstName;
  else {
    if(invoice.senderName)
      senderName = invoice.senderName.split(' ')[0];
    else
      senderName = 'Counselor';
  }


  switch(invoice.status) {
    case constant.INVOICE_SENT:
      htmlStr = `<div class="invoice-message"><main class="invoice-message__main"><div class="invoice-message__content"><div class="invoice-message__title">${senderName} sent an invoice.</div><div class="invoice-message__text"></div></div><div class="invoice-message__additional"><a class="invoice-message__button invoice-message-view-button" href="${invoiceUrl}"> View Invoice </a></div></main><footer class="invoice-message__footer"><span>${invoice.dueDateOption === constant.DUE_DATE_OPTION.UPON_RECEIPT ? '<strong>pay upon receipt</strong>' : '<strong>Invoice is due on</strong> ' + moment(invoice.dueAt).format('DD/MM/YYYY')}</span></footer></div>`;
      break;
    case constant.INVOICE_PAID:
      htmlStr = `<div class="invoice-message invoice-message_success"><main class="invoice-message__main"><div class="invoice-message__content"><div class="invoice-message__title">${senderName} sent an invoice.</div><div class="invoice-message__text"></div></div><div class="invoice-message__additional"><a class="invoice-message__button invoice-message-view-button" href="${invoiceUrl}"> View Invoice </a></div></main><footer class="invoice-message__footer"><span><strong>Invoice Paid on</strong> ${moment(invoice.paidAt).format('DD/MM/YYYY')}</span></footer></div>`;
      break;
    default:
      console.log(invoice.invoiceType);
      throw Error('Invalid invoice type');
  }

  return htmlStr;
}

module.exports = {
  //getToken,
  authorize: getToken,
  sendMessage
}
