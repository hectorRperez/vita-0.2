const router = require('express').Router();

// ruta inicial
router.get('/blog', (req, res) => {
   

	try {
		res.render('blog.ejs');
	} catch (error) {
		console.error(error);
	}

});

module.exports = router;
