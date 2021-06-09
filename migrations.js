'use strict'

const mysql = require('mysql');
const fs = require('fs');

// carga de archivo de configuración
const config = require('./config.js');

// creo la conexion
let connection = mysql.createConnection(config.mysql);


// elimino las tablas si existen
connection.query("DROP TABLE IF EXISTS products, categories, users_types_users, users, users_types", null, function(err, result, fields) {
	if(err) throw err.sqlMessage;
	console.log('Drop all Table');
});

//creando tabla de usuarios
connection.query("CREATE TABLE users ( id int(11) NOT NULL AUTO_INCREMENT, full_name varchar(50) NOT NULL, email varchar(255) NOT NULL, password varchar(255) NOT NULL, PRIMARY KEY (id) )", null, function(err, result, fields) {
	if(err) throw err.sqlMessage;
	console.log('Table users has been created');
});

//creando tabla tipos de usuarios
connection.query("CREATE TABLE users_types ( id int(11) NOT NULL AUTO_INCREMENT, type varchar(50) NOT NULL, PRIMARY KEY (id))", null, function(err, result, fields) {
	if(err) throw err.sqlMessage;
	console.log('Table users_types has been created');
});


//creando tabla users types users
connection.query("CREATE TABLE users_types_users ( id int(11) NOT NULL AUTO_INCREMENT, user_id int(11) NOT NULL, user_type_id int(11) NOT NULL,  PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (user_type_id) REFERENCES users_types(id) )", null, function(err, result, fields) {
	if(err) throw err.sqlMessage;
	console.log('Table users_types_users has been created');
});

// creando tabla de categorias
connection.query("CREATE TABLE categories ( id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, PRIMARY KEY (id) )", null, function(err, result, fields) {
	if(err) throw err.sqlMessage;
	console.log('Table categories has been created');
});

// crando tabla de productos
connection.query("CREATE TABLE products ( id int(11) NOT NULL, name varchar(50) NOT NULL, price double(11,2) NOT NULL, quantity int(4) NOT NULL, category_id int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (category_id) REFERENCES categories(id) )", null, function(err, result, fields) {
	if(err) throw err;
	console.log('Table products has been created');
});


connection.end();


