const Product = require("../model/product");
const Cart = require("../model/cart");
const upload= require("./upload");


// exports.createProduct = async (req, res) => {
//     try {
//         const { name, price, productImage } = req.body;
 
//         // Check for required fields
//         if (!name ||!price ||!productImage) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All Fields Are Required",
//             });
//         }

//         // Create a new product
//         const upload_image= await upload.uploadFile(productImage);
//         const newProduct = await Product.create({
//             pid: null,
//             name: name,
//             price: price,
            
//             productImage: upload_image.secure_url,
//         });

//         console.log(newProduct);

//         // Set the pid to the new product's _id
//         newProduct.pid = newProduct._id;
//         await newProduct.save();

//         return res.status(201).json({
//             success: true,
//             message: "Product Listed Successfully",
//             Product_id: newProduct.pid,
//         });
//     } catch (error) {
//         console.error(error.message); // Use console.error for error logging
//         return res.status(500).json({
//             success: false,
//             message: "Error in Product Listing",
//             error: error.message, // Optionally include the error message
//         });
//     }
// };


exports.createProduct = async (req, res) => {
    try {
        const { name, price } = req.body; // Removed productImage from here

        // Check for required fields
        if (!name || !price || !req.file) { // Check if req.file exists
            return res.status(400).json({
                success: false,
                message: "All Fields Are Required",
            });
        }

        // Upload the image to Cloudinary
        const upload_image = await upload.uploadFile(req.file.buffer); // Use the buffer from Multer

        // Create a new product
        const newProduct = await Product.create({
            pid: null,
            name: name,
            price: price,
            productImage: upload_image.secure_url, // Use the secure URL from Cloudinary
        });

        console.log(newProduct);

        // Set the pid to the new product's _id
        newProduct.pid = newProduct._id;
        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: "Product Listed Successfully",
            Product_id: newProduct.pid,
        });
    } catch (error) {
        console.error(error.message); // Use console.error for error logging
        return res.status(500).json({
            success: false,
            message: "Error in Product Listing",
            error: error.message, // Optionally include the error message
        });
    }
};


exports.updateProduct= async (req,res)=>{

  try{
 const {id} = req.params;

 const {name,price,productImage} = req.body;
if(!name||!price||!productImage){
    return res.status(500).json({
        success:false,
        message:"All Fields Are Required",
    });
}
 

 const updatedProduct= await product.findByIdAndUpdate(id,{ 
    name:name,
    price:price,
    
    productImage:productImage,
    
} ,{new:true});


console.log("updatesProduct",updatedProduct);
return res.status(200).json({
    success:true,
    message:"  Product Updated Successfully ",
});
  }
  catch(error){
    console.log(error.message);

    return res.status(500).json({
        success:false,
        message:"Error in Product Updation ",
    });
  }

}

exports.getAllProduct = async(req,res)=>{
    try{
 const products = await Product.find() ;
console.log(products);
 return res.status(200).json({
    success:true,
    message:"  Product Fetched Successfully ",
    product:products,
});
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Error in Product Fetching ",
        });
    }
}

exports.deleteProduct= async(req,res)=>{
    try{
 const {id} = req.params;
 const deletedProduct = await product.findByIdAndDelete(id);
  
    
  

return res.status(200).json({
    success:true,
    message:"  Product Deleted Successfully ",
});


    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Error in Product Deletion ",
        });
    }
}


