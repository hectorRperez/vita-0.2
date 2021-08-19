'use strict'

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); //agregamos esta linea
const passport = require('passport');
const path = require('path');
const multer = require('multer');

const app = express();

// defino la variable de entorno
require('dotenv').config({
	path: `.env.${process.env.NODE_ENV || 'development'}`
})

// configurando donde se guardan las imagenes
const storage = multer.diskStorage({

	destination: function(req, file, cb) {
		cb(null, path.join(__dirname, 'public/img') );
	}, 

	filename: function(req, file, cb) {
		const img = `${Date.now()}${Math.floor(Math.random() * 100)}`;
		cb(null, `product-${ img }.jpeg`);
	}
	
});

// configuracion de formulario 
app.use(express.urlencoded( {extended: true } ));

app.use( multer({
	storage,
	dest: path.join(__dirname, 'public/img'),
	limits: {fileSize: 500000}
}).array('image', 6));

// configuracion de la cookies
app.use( cookieParser('5654534jk34kjnk346kjn652gf2') );

// configuro el almacen de sesion de mysql
const sessionStore = new MySQLStore({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DATABASE,
	clearExpired: true,
	checkExpirationInterval: 900000,
	expiration: 3600000
});

// configurando la sesion
app.use( session({
	secret: "ertt0923723kjnf29v762vl23ov8",
	cookie: {maxAge: 3600000, secure:false},
	store: sessionStore,
	resave: true,
	saveUninitialized: true
} ));

// inizializando el passport
app.use( passport.initialize() );
app.use( passport.session() );

// definiendo el motor de platillas
app.set("views", path.join(__dirname, "/views") );
app.set('view engine', 'ejs');

//  definiendo la autenticacion
require('./auth.js')(passport);

// archivos estaticos
app.use( express.static( path.join(__dirname, '/public') ) );

// rutas
app.use( require('./routes.js') );


// escuchando
app.listen(process.env.PORT, process.env.HOST , () => {
	console.log(`App listening at http://localhost:${process.env.PORT}`)
});

