const rfr = require('rfr');
const rapi = require('./railsapi');
const invoiceModel = rfr('/server/models/invoice');



const test = async () => {
  const list = await invoiceModel.all();

  list.forEach( async (invoice) => {
    try {
      await rapi.sendMessage(invoice);
    }catch(e){
      console.log(e);
    }
  });
}

test();
