
const express = require('express');
const router = express.Router();


// ruta que se carga si el usuario ha iniciado sesion
router.get('/shop', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, (req, res) => {
	console.log(req.user);
	res.render('shop.ejs',{user: req.user});
});




module.exports = router;