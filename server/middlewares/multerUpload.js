const multer = require('multer');

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }).single('productImage'); // 'my_file' is the field name

module.exports = upload;