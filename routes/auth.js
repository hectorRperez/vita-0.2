const router = require('express').Router();
const passport = require('passport');

// ruta que muestra el formulario de login
router.get('/login', (req, res) => {
	res.render('login.ejs');
});


// ruta que se encarga de iniciar sesion
router.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login' } ),
	function(req, res) {
		res.redirect('/shop1');
	}
);

// ruta para mostrar el formulario de registro de usuario
router.get('/signup', (req, res) => {
	res.render('signup.ejs');

});

// ruta para mostrar el formulario de registro de usuario
router.post('/signup',
	passport.authenticate('local', { failureRedirect: '/signup'}),
	(req, res) => {
		res.redirect("/shop1");
	}
);



module.exports = router;