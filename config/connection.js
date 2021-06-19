const config = require('./config.js');
const mysql = require('mysql');

// creo la conexion con la base de datos
const connection = mysql.createConnection(config.mysql);

module.exports = connection;