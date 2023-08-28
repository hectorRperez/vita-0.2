const multer = require("multer");
const path = require("path");
// Configure Multer

const dir = path.join(__dirname, "../public/img");

const upload = (folderName) => {
  return imageUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(dir, folderName));
      },

      // By default, multer removes file extensions so let's add them back
      filename: function (req, file, cb) {
        const img = `${Date.now()}${Math.floor(Math.random() * 100)}`;
        cb(null, img + path.extname(file.originalname));
      }
    }),
    // limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(null, false);
      }

      cb(null, true);
    }
  })
}

module.exports = upload;
