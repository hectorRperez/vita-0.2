const router = require('express').Router();

// ruta inicial
router.get('/faq', (req, res) => {
   

	try {
		res.render('faq.ejs');
	} catch (error) {
		console.error(error);
	}

});

module.exports = router;
