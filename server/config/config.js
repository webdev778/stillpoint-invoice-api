var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'AKIAJ3BROA3Z5WZP5PXA',
    pass: 'Air9h8yJtcr5ns8Hqo/OVtJudQnalYqpe4xZVv9NiL9t'
  }
});

// setup email data with unicode symbols
var mailOptions = {
  from: 'Legably <support@legably.com>', // sender address
  to: '', // list of receivers
  subject: '', // Subject line
  text: '', // plain text body
  html: '' // html body
};

var fileUploadPath = __dirname.replace('server/config' , 'public/uploaded_files');
var hostPath = "https://www.legably.com";

var s3Bucket = "legably-prod";

var aws = {
  "key": "AKIAJPC6YQCAQEDQTGNA",
  "secret": "Xh1TDP8AZr+lZeltL9/9r90eQWgmhFV44smVUrcw",
  "bucket": s3Bucket
};

var bucketUrl = "https://" + s3Bucket + ".s3.amazonaws.com/";

module.exports = {
    mailOptions: mailOptions,
    transporter: transporter,
    fileUploadPath : fileUploadPath,
    hostPath : hostPath,
    aws: aws,
    bucketUrl: bucketUrl,
    server: {
      host: '0.0.0.0',
      port: 3001
    },
   database: {
    host: 'www.legably.com',
    port: 21000,
    db: 'Legably',
    username: 'userlegably',
    password: 'RctgXd8Nh3j46bnE'
  },
};
