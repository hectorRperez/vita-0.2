const express = require('express');
const passport = require('passport');
const path = require('path');
const mysql = require('mysql');

const router = express.Router();

const dir = path.join( __dirname, '/views/');

// ruta inicial
router.get('/', (req, res) => {
	res.sendFile( dir + 'index.html');
});


// ruta que se carga si el usuario ha iniciado sesion
router.get('/p', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, (req, res) => {
	res.send("Bienvenido has iniciado sesion");
});


// ruta que muestra el formulario de login
router.get('/login', (req, res) => {
	res.sendFile(dir + 'login.html');
});


// ruta que se encarga de iniciar sesion
router.post('/auth', passport.authenticate("local", {
	successRedirect: "/p",
	failureRedirect: "/login"
}) );



// ruta para mostrar el formulario de registro de usuario
router.post('/signin', (req, res) => {

});





module.exports = router;