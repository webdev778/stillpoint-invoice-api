
const rfr = require('rfr');
const invoiceModel = rfr('/server/models/invoice');

const test = () => {

    invoiceModel.setStatusAsPaid(3);
}
test();