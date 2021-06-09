'use strict'

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const app = express();

// carga de archivo de configuración
const config = require('./config.js');

app.use(express.urlencoded( {extended: true } ));

app.use( cookieParser('5654534jk34kjnk346kjn652gf2') );

app.use( session({
	secret: "ertt0923723kjnf29v762vl23ov8",
	expires : new Date(Date.now() + 21600000),
	resave: true,
	saveUninitialized: true
} ));

app.use( passport.initialize() );
app.use( passport.session() );

app.set("views", path.join(__dirname, "/views") );
app.set('view engine', 'ejs');


require('./auth.js')(passport);


// archivos estaticos
app.use( express.static( path.join(__dirname, '/public') ) );


// rutas
app.use( require('./routes.js') );


// escuchando
app.listen(config.port, '127.0.0.1' , () => {
	console.log(`App listening at http://localhost:${config.port}`)
});

