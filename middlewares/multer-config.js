const multer = require('multer');

const MIME_TYPE = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './images');
  },
  filename: (req, file, callback) => {
    const originalFilename = file.originalname;
    const extension = originalFilename.split('.').pop(); // Get the file extension

    // Replace spaces in filename and remove the extension
    const filenameWithoutExtension = originalFilename.replace(/\s+/g, '_').replace(/\.[^.]+$/, '');

    callback(null, filenameWithoutExtension + Date.now() + '.' + extension);
  },


});

module.exports = multer({ storage }).single('image');
