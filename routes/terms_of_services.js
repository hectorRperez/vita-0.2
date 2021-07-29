const router = require('express').Router();

// ruta inicial
router.get('/faq', (req, res) => {
   

	try {
		res.render('ter.ejs');
	} catch (error) {
		console.error(error);
	}

});

module.exports = router;
