'use strict';

const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;
const fs = require('fs');
const path = require('path');

const app = express();


// carga de archivo de configuración
let config = JSON.parse( fs.readFileSync('src/config.json') );

app.use(express.urlencoded( {extended: true } ));

app.use( cookieParser('5654534jk34kjnk346kjn652gf2') );

app.use( session({
	secret: "ertt0923723kjnf29v762vl23ov8",
	resave: true,
	saveUninitialized: true
} ));

app.use( passport.initialize() );
app.use( passport.session() );


// definiendo la estrategia de autenticacion
passport.use('login', new passportLocal( {}, function(email, password, done) {
	 
	console.log(email, password);
	
	if(email == "jesus.m.423@hotmail.com" && password == "12345")
		done(null, {name: 'jesus', id: 1});
	else
		done(err, false);
}));


// serializacion de un usuario
passport.serializeUser(function(user, done) {
	done(null, user.id);
})

// deserializacion de usuarios
passport.deserializeUser( function(id,done) {
	done( null, {name: 'jesus rogliero', id: 1});
})

// archivos estaticos
app.use( express.static( path.join(__dirname, '/public') ) );


// rutas
app.use( require('./routes.js') );


// servidor a la escucha
app.listen(config.port, () => {
	console.log("server run");
});


