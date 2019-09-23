
const rfr = require('rfr');
const invoiceModel = rfr('/server/models/invoice');

const test = async () => {

    // invoiceModel.setStatusAsPaid(3);
    try{
    const result = await invoiceModel.getNewInvoiceSn(137);
        console.log(result[0].nextSn);
    }catch(e){
        console.log(e);
    }
}
test();