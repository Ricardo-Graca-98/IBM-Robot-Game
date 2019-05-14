var nodemailer = require('nodemailer');
var fs = require('fs');

var Credentials = fs.readFileSync('Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials);



var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ParsedCredentials.NiceBotsEmail[0].email,
      pass: ParsedCredentials.NiceBotsEmail[0].key
    }
  });
  
  var mailOptions = {
    from: 'nicebotsIBM@gmail.com',
    to: 'ricardo.graca17@bathspa.ac.uk',
    subject: 'Verify your email - NiceBots',
    text: 'Please verify your email cunt!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error)
    {
      console.log(error);
    }
    else
    {
      console.log('Email sent: ' + info.response);
    }
  }); 