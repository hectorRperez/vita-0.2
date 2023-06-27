const multer = require("multer");
const path = require("path");
// Configure Multer

const dir = path.join(__dirname, "../public/img");
const dirProducts = path.join(dir, "products");
const dirPost = path.join(dir, "post");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dirProducts);
  },
  filename: function (req, file, cb) {
    const img = `${Date.now()}${Math.floor(Math.random() * 100)}`;

    if (req.url === "/new_post") cb(null, `post-${img}.jpeg`);

    if (req.url === "/products") cb(null, `product-${img}.jpeg`);
  },
});

const upload = multer({ storage });

module.exports = upload;
