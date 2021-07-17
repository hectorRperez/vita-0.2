'use strict'

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const multer = require('multer');

const app = express();

// carga de archivo de configuración
const config = require('./config/config');

// configurando donde se guardan las imagenes
const storage = multer.diskStorage({

	destination: function(req, file, cb) {
		cb(null, path.join(__dirname, 'public/img') );
	}, 

	filename: function(req, file, cb) {
		cb(null, `product-${Date.now()}.jpeg`);
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

// configurando la sesion
app.use( session({
	secret: "ertt0923723kjnf29v762vl23ov8",
	maxAge : new Date(Date.now() + 21600000),
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
app.listen(config.port, '127.0.0.1' , () => {
	console.log(`App listening at http://localhost:${config.port}`)
});

