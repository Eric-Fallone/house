var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ERIC_EMAIL_ACCOUNT,
    pass: process.env.ERIC_EMAIL_PASSWORD
  }
});

module.exports={
  sendEmail :function(emailData) {

    var mailOptions = {
      from: process.env.ERIC_EMAIL_ACCOUNT,
      to: process.env.ANDREW_EMAIL_ACCOUNT,
      subject:emailData.first+" "+emailData.last+" from "+ emailData.company,
      text: emailData.company+"\n\n"+emailData.first+" "+emailData.last+"\n\n"+emailData.message+"\n\n"+emailData.telephone
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        discord.webHook(emailData.first+" "+emailData.last+" from "+ emailData.company+" has send you an email.");
      }
    });
  }
}
