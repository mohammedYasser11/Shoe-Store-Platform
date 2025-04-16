const multer = require('multer');

// Memory storage or configure disk if needed
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
