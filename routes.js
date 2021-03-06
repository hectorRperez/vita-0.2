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
router.use( require("./routes/returns_exchanges.js") );
router.use( require("./routes/terms_of_services.js") );
router.use( require("./routes/privacy_policies.js") );

module.exports = router;

