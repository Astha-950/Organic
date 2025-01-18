const mongoose = require("mongoose");
require("dotenv").config();

const databaseConnect =()=>{
  
  mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser:true,
        useUnifiedTopology:true,
  })
  .then(()=>{
    console.log("Database Connection Successfull")
  })
 .catch((error)=>{

    console.log("Error Occurred in Database Connecton ");
    console.error(error.message);
     
    process.exit(1);
 })
};
module.exports=databaseConnect;
