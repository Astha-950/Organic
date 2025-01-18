const mongoose= require("mongoose");

const sellerSchema = new mongoose.Schema({

firstName:{
    type:String,
    required:true,
    trim:true,
},
lastName:{
    type:String,
    required:true,
    trim:true,
},
phoneNo:{
    type:String,
    required:true,
    
},
email:{
    type:String,
    required:true,
},


password:{
    type:String,
    required:true,
},
 
gender:{
    type:String,
    requird:true,
},
image:{
    type:String,

},
// history:[
//     {
//     type:mongoose.Schema.Types.ObjectId,

//     }
// ],

// ratingAndReview:[{
//     type:mongoose.Schema.Types.ObjectId,

// }],

product:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"product",

}],
shopName:
    {
   type:String,
   required:true,
    },
 

accountType:{
    type:String,
    enum:["Seller"],
    required:true,
},


 


});

module.exports= mongoose.model("seller",sellerSchema);

