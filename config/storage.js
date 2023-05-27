const fs = require("fs");
const multer = require("multer");
const path = require("path");

// configurando donde se guardan las imagenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!path.existsSync(dir)) fs.mkdirSync(dir, 7777);

    if (req.url === "/new_post")
      cb(null, path.join(__dirname, "public/img/posts"));

    if (req.url === "/create_product")
      cb(null, path.join(__dirname, "public/img/products"));
  },

  filename: function (req, file, cb) {
    const img = `${Date.now()}${Math.floor(Math.random() * 100)}`;

    if (req.url === "/new_post") cb(null, `post-${img}.jpeg`);

    if (req.url === "/create_product") cb(null, `product-${img}.jpeg`);
  },
});

module.exports = multer({
  storage,
  dest: path.join(__dirname, "public/img"),
  limits: { fileSize: 500000 },
}).array("image", 6);
