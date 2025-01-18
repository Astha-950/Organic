const mailsender = require("../utils/mailsender");

async function sendMail(email,title,body,from){
    try{
 //what does this mailresponse  have in 
const mailresponse = await mailsender(email,title,body,from);
console.log("Email Sent Succesfully",mailresponse);
 
    }
    catch(error){
        console.log("error occured while sending mails ",error);
throw error; 
    }
}
module.exports = sendMail;