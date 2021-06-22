const router = require('express').Router();

// ruta inicial
router.get('/', (req, res) => {
    

	res.render('index.ejs');
});

module.exports = router;
