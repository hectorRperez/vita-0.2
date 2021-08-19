const router = require('express').Router();

// ruta inicial
router.get('/returns_exchanges', (req, res) => {
   

	try {
		res.render('returns_exchanges.ejs');
	} catch (error) {
		console.error(error);
	}

});

module.exports = router;