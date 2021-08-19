const router = require('express').Router();

// ruta inicial
router.get('/terms_of_services', (req, res) => {
   

	try {
		res.render('terms_of_services.ejs');
	} catch (error) {
		console.error(error);
	}

});

module.exports = router;
