'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// carga de archivo de configuración
let config = JSON.parse( fs.readFileSync('src/config.json') );


// archivos estaticos
app.use( express.static( path.join(__dirname, '/public') ) );


// routes
app.use( require('./routes.js') );


// servidor a la escucha
app.listen(config.port, () => {
	console.log("escuchando");
});


