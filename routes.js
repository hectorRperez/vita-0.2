'use strict'

const express = require('express');
const router = express.Router();

router.use( require('./routes/auth.js') );
router.use( require('./routes/shop.js') );
router.use( require('./routes/products.js') );
router.use( require('./routes/home.js') );
router.use( require('./routes/skincare.js') );
router.use( require('./routes/orders.js') );
router.use( require("./routes/faq.js") );
router.use( require("./routes/contact_us.js") );
router.use( require("./routes/blog.js") );

module.exports = router;

