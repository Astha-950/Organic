// const cloudinary = require("cloudinary").v2;
          
// cloudinary.config({ 
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET
// });

// const uploadFile = async(filePath) => {

//     try {
        
//         const result = await cloudinary.uploader.upload(filePath);
//         console.log(result)
//         return result;
//     } catch (error) {
//         console.log(error.message);
//     }

// }

// module.exports = {
//     uploadFile
// }





const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Function to upload a file buffer to Cloudinary
const uploadFile = async (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });

        // Pipe the file buffer to Cloudinary
        uploadStream.end(fileBuffer);
    });
};

module.exports = {
    uploadFile
};