const rfr = require('rfr');
const subject = rfr('/server/lib/stripe/connect');

const test = async () => {
  try {
    const ret1 = await subject.dashboardUrl();
    console.log(ret1);
  }catch(e){
    console.log(e);
  }

  try {
    const result = await subject.connect('authCode');
    console.log(result);
  }catch(e){
    console.log('failed to connect');
  }

  try {
    await subject.disconnect('stripeUserId');
  }catch(e){
    console.log('failed to disconnect');
  }
}

test();
