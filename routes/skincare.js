const router = require("express").Router();

// ruta que se carga de traer los productos
router.get('/skincare', (req, res) => {

    res.render('skincare');

});


module.exports = router;