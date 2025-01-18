const express= require("express");

const router= express.Router();
const  {signupBuyer,loginBuyer }= require("../controller/Authentication");

const {createCart,deleteItem,getAllCartItem,updateCart}= require("../controller/cart");
const {createProduct,getAllProduct}= require("../controller/product");
const guestController= require("../controller/guest");

const upload = require('../middlewares/multerUpload');



router.post('/products', upload, createProduct); 


 router.post("/buyerlogin",loginBuyer);
 router.post("/buyersignup",signupBuyer);


 

 router.post("/createCart",createCart);
 router.get("/getAllCartItem/:buyer_id",getAllCartItem);
 router.delete("/deleteitem",deleteItem);
 router.put("/updateCart", updateCart);


 router.post("/createProduct",createProduct);
 router.get("/getAllProduct",getAllProduct);
  

 router.post('/guest/register', guestController.registerGuestOnClick);

 // Route to add item to cart
 router.post('/cart/add', guestController.addToCart);
 
 // Route to remove item from cart
 router.delete('/cart/remove', guestController.removeFromCart);
 
 // Route to view cart
 router.get('/cart/view', guestController.viewCart);
 
 // Route to clear cart
 router.delete('/cart/clear', guestController.clearCart);
 
 // Route to update item quantity
 router.put('/cart/update', guestController.updateCart);


module.exports= router;


