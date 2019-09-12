var rfr = require('rfr');

var utils = rfr('/server/shared/utils');
var db = rfr('/server/db');


const pay = async (req, res) => {
    const cb = (result) => {
        utils.sendResponse(res, result);
    }

    utils.writeInsideFunctionLog('stripeCheckout', 'pay');
    const id = req.params.id;

    if (!id) {
      cb({ Code: 400, Status: true, Message: 'Bad Request' });
      return;
    }

    try {
      const invoice = await db.Invoice.findOne({ where: { id }, include:[{
          model: db.Counselor,
          include: [db.StripeConnect]
      }] });

      if (!invoice) {
        console.log('invalid invoice id');
        cb({ Code: 400, Status: true, Message: 'Bad Request' });
        return;
      }

      // Todo validate invoice if invoice client is loggedin user
      const counselorId = invoice.counselorId;
      if(!counselorId){
        console.log('counselor invalid');
        cb({ Code: 400, Status: true, Message: 'Bad Request' });
        return;
      }

      const stripeConnect = invoice.Counselor.StripeConnect;

      if (!stripeConnect || !stripeConnect.accessToken){
        console.log('yet connected to stripe properly');
        cb({ Code: 400, Status: true, Message: 'Bad Request' });
        return;
      }

      const stripe = require('stripe')(stripeConnect.accessToken);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          name: 'T-shirt',
          description: 'Comfortable cotton t-shirt',
          images: ['https://example.com/t-shirt.png'],
          amount: 500,
          currency: 'gbp',
          quantity: 1,
        }],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });

      const ret = {
        stripeSession : session,
        stripePublishableKey: stripeConnect.stripePublishableKey
      };

      cb(ret);
    } catch (e) {
      console.log(e);
      cb({ Code: 500, Status: true, Message: 'Failed to pay invoice' });
    }
  }

module.exports = {
    pay
}
