var nodemailer = require('nodemailer');
const mailsender = async (email,title,body,from)=>{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'organic266@gmail.com',
    // pass: 'gncn wdez sxpb eivo'
  }
});

var mailOptions = {
  from: `${from}`,
  to: `${email}`,
  subject: `${title}`,
  text: `${body}`,
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});}
module.exports =mailsender;