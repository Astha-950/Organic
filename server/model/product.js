const mongoose = require("mongoose");
 const productSchema = new mongoose.Schema({
pid:{
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId 
},
    name:{
    type:String,
    required:true,
    trim:true,

},
price:{
    type:Number,
    required:true,
    trim:true,

},
 
productImage:{
    type:String,
    required:true,
},



 });

  
 module.exports= mongoose.model("product",productSchema);