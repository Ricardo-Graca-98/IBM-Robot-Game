var nodemailer = require('nodemailer');
var fs = require('fs');

require('dns').lookup(require('os').hostname(), function (err, add, fam) 
{
  var ip = add;
  console.log(ip);
})

var Credentials = fs.readFileSync('Keys.json', 'utf-8');
var ParsedCredentials = JSON.parse(Credentials);
var checkEmails = fs.readFileSync('sendAuth.txt', 'utf8');

var transporter = nodemailer.createTransport
({
  service: 'gmail',
  auth: 
  {
    user: ParsedCredentials.NiceBotsEmail[0].email,
    pass: ParsedCredentials.NiceBotsEmail[0].key
  }
});

//setTimeout(sendEmail, 100);
function sendEmail(email, name)
{
  var mailOptions = 
  {
    from: 'nicebotsIBM@gmail.com',
    to: email,
    subject: 'Verify your email - NiceBots',
    text: 'Please verify your email by accessing this link -> ' + name
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
}