'use strict'

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const path = require('path');

const app = express();

// carga de archivo de configuración
const config = require('./config.js');

const connection = require("./connection.js");
const { chownSync } = require('fs');
const { request } = require('http');

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
passport.use('local', new LocalStrategy({

	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true

}, function(req, email, password, done) {
	console.log(req.body);

	if(req.body.signup != null) {

		bcrypt.hash(req.body.password, 10, function(err, hash) {
			if(err) throw err.sqlMessage;
	
			connection.query('INSERT INTO users (full_name, email, password) VALUES (?,?,?)', [req.body.full_name, req.body.email, hash], function (err, results, fields) {
				if(err) throw err;

				console.log(results, fields);
	
			});
		});

	}else if( req.body.login != null) {

		connection.query('SELECT * FROM `users` WHERE `email` = ?', [email], function (err, results, fields) {

			if(results[0] != null){
				
				bcrypt.compare(password, results[0].password, function(err, hashResult) {
					if(err) throw err;

					if(hashResult)
						done(null, results[0]);
					else
						done('verifica tu correo o contraseña', false);
				});
			}
	
		});

	}
	

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


// escuchando
app.listen(config.port, () => {
	console.log(`App listening at http://localhost:${config.port}`)
});

