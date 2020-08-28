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
      subject:emailData.name+" - "+emailData.subject,
      text: emailData.name+"\n\n"+emailData.email+"\n\n" + emailData.subject + "\n\n" + emailData.message
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}
