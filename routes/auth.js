const express = require('express');
const passport = require('passport');
const path = require('path');

const router = express.Router();


// ruta inicial
router.get('/', (req, res) => {
	res.render('index.ejs');
});


// ruta que muestra el formulario de login
router.get('/login', (req, res) => {
	res.render('login.ejs');
});


// ruta que se encarga de iniciar sesion
router.post('/login', 
	passport.authenticate('local', { failureRedirect: '/login' } ),
	function(req, res) {
		res.redirect('/shop');
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
		res.redirect("/shop");
	}
);



module.exports = router;