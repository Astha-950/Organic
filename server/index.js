const express = require("express");
const cors = require('cors');
const app= express();
require("dotenv").config();
const path = require('path');
const PORT =process.env.PORT||3000;
const secret_key =process.env.secret_key ;


const session = require('express-session');

 

 


app.use(session({
    secret: secret_key,  
    resave: false, 
    saveUninitialized: true,  
    cookie: { secure: false }  
}));



app.use(express.json());




app.use(express.urlencoded({ extended: true }));
 
app.use(cors());

 
 
app.use(express.static(path.join(__dirname, '../E-commercePlateformFrontend')));


const ecommerce=require("./routes/E-commerceRoute");
app.use("/api/v1",ecommerce);
 
const databaseConnect = require("./config/database");
databaseConnect();

app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);

})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../E-commercePlateformFrontend/login.html'));
});