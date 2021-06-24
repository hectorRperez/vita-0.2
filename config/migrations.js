'use strict'
const bcrypt = require('bcrypt');
// obtengo la connexion;
let connection = require('./connection.js');

const tables = [
	{name:'Drop all table', sql: "DROP TABLE IF EXISTS home_products, products, categories, users_types_users, users, users_types, home_info"},
	{name:'users', sql: "CREATE TABLE users ( id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, lastname varchar(50) NOT NULL, image varchar(255), email varchar(255) NOT NULL UNIQUE, password varchar(255) NOT NULL, PRIMARY KEY (id) )"},
	{name:'users_types', sql: "CREATE TABLE users_types ( id int(11) NOT NULL AUTO_INCREMENT, type varchar(50) NOT NULL, PRIMARY KEY (id))"},
	{name:'users_types_users', sql: "CREATE TABLE users_types_users ( id int(11) NOT NULL AUTO_INCREMENT, user_id int(11) NOT NULL, user_type_id int(11) NOT NULL,  PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (user_type_id) REFERENCES users_types(id) )"},
	{name:'categories', sql: "CREATE TABLE categories ( id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, PRIMARY KEY (id) )"},
	{name:'products', sql: "CREATE TABLE products ( id int(11) NOT NULL AUTO_INCREMENT,image varchar(255), name varchar(50) NOT NULL, price double(11,2) NOT NULL, quantity int(4) NOT NULL, assessment INT(1) NOT NULL DEFAULT 0, sales_quantity INT(5) NOT NULL DEFAULT 0, category_id int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (category_id) REFERENCES categories(id) )"},
	{name:'home_products', sql: "CREATE TABLE home_products ( id int(2) NOT NULL AUTO_INCREMENT, product_id int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (product_id) REFERENCES products(id))"},
	{name:'home_info', sql: "CREATE TABLE home_info ( id int(2) NOT NULL AUTO_INCREMENT, mision TEXT NOT NULL, history TEXT NOT NULL, vision TEXT NOT NULL, PRIMARY KEY (id) )"}
];

for (let i = 0; i < tables.length; i++) {
	
	connection.query(tables[i].sql, null, function(err, result, fields) {
		if(err) throw err.sqlMessage;
		
		if(i == 0)
			console.log(tables[i].name);
		else
			console.log(`Table ${tables[i].name} has been created`);
	});
	
}

// funcion que genera los hash de constraseña
const genHash = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, function(err, hash) {
			if(err) reject(err);
			resolve(hash);
		});
	});
}

//funcion que envia las consultas
const querySync = (sql, name) => {
	return new Promise((resolve, reject) => {
		connection.query(sql, null, function(err, result, fields) {
			if(err) reject(err);
			
			resolve(`${name} has been created`);
		});
	});
}



const seed = async function() {

	const password = 'manager';
	const seeds = [

		// creando usuarios
		[
			{name:'Admin Jesus', sql: `INSERT INTO users (name, lastname, email, password) VALUES ('Jesus','Rogliero','rogliero@admin.com','${await genHash(password)}')`},
			{name:'Admin hector', sql: `INSERT INTO users (name, lastname, email, password) VALUES ('Hector','Perez','perez@admin.com','${await genHash(password)}')`},
		],
	
		// creando categorias
		[
			{name:'Category 1', sql: "INSERT INTO categories (name) VALUES ('Categoria 1')"},
			{name:'Category 2', sql: "INSERT INTO categories (name) VALUES ('Categoria 2')"},
			{name:'Category 3', sql: "INSERT INTO categories (name) VALUES ('Categoria 3')"},
			{name:'Category 4', sql: "INSERT INTO categories (name) VALUES ('Categoria 4')"},
		],
	
		// creando productos
		[
			{name:'product 1', sql: "INSERT INTO products (name, image, price, quantity, category_id) VALUES ('Tacones Rosas', 'img/pic2.png', 75.66, 3, 1 )"},
			{name:'product 2', sql: "INSERT INTO products (name, image, price, quantity, category_id) VALUES ('Mochila Moderna', 'img/pic12.png', 6.99, 1, 3 )"},
			{name:'product 3', sql: "INSERT INTO products (name, image, price, quantity, category_id) VALUES ('Zapatos Deportivos', 'img/pic8.png', 24.99, 4, 2 )"},
			{name:'product 4', sql: "INSERT INTO products (name, image, price, quantity, category_id) VALUES ('Chaqueta Deportiva', 'img/pic4.png', 17.45, 10, 4 )"},
			{name:'product 5', sql: "INSERT INTO products (name, image, price, quantity, category_id) VALUES ('Laptop', 'img/product1.jpg', 349.99, 1, 1 )"},
		]
	
	];
	
	// recorriendo cada array para insertar los datos
	for (let i = 0; i < seeds.length; i++) {
	
		for (let j = 0; j < seeds[i].length; j++) {
			
			const log = await querySync(seeds[i][j].sql, seeds[i][j].name).then(r => r);
			console.log(log);
		}
		
	}

	connection.end();
}


seed();





