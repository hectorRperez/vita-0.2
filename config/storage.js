const fs = require("fs");
const multer = require("multer");
const path = require("path");

const dir = path.join(__dirname, "/../public/img");
const dirProducts = path.join(dir, "products");
const dirPost = path.join(dir, "post");
// configurando donde se guardan las imagenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, 7777);
    if (!fs.existsSync(dirProducts)) fs.mkdirSync(dirProducts, 7777);
    if (!fs.existsSync(dirPost)) fs.mkdirSync(dirPost, 7777);
    if (req.url === "/new_post") cb(null, dirPost);

    if (req.url === "/create_product") cb(null, dirProducts);
  },

  filename: function (req, file, cb) {
    const img = `${Date.now()}${Math.floor(Math.random() * 100)}`;

    if (req.url === "/new_post") cb(null, `post-${img}.jpeg`);

    if (req.url === "/create_product") cb(null, `product-${img}.jpeg`);
  },
});

module.exports = multer({
  storage,
  dest: dir,
  limits: { fileSize: 500000 },
}).array("image", 6);
