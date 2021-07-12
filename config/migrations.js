'use strict'
const bcrypt = require('bcrypt');
// obtengo la connexion;
let connection = require('./connection.js');

try {
	
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
	
	
	/**
	 * Fucion asincrona que genera las tablas necesarias
	 * para la base de datos
	 * 
	 * Ademas genera datos por defecto y algunos de prueba
	 * 
	 */
	const seed = async function() {

		const tables = [
			{name: "", sql:"SET FOREIGN_KEY_CHECKS = 0"},
			{name:'Drop all table', sql: "DROP TABLE IF EXISTS home_products, orders_items, orders, orders_states, taxes, products, categories, users_types_users, users, users_types, home_info"},
			{name: "", sql:"SET FOREIGN_KEY_CHECKS = 1"},
			{name:'Table users', sql: "CREATE TABLE users ( id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, lastname varchar(50) NOT NULL, image varchar(255), email varchar(255) NOT NULL UNIQUE, password varchar(255) NOT NULL, PRIMARY KEY (id) )"},
			{name:'Table users_types', sql: "CREATE TABLE users_types ( id int(11) NOT NULL AUTO_INCREMENT, type varchar(50) NOT NULL, PRIMARY KEY (id))"},
			{name:'Table users_types_users', sql: "CREATE TABLE users_types_users ( id int(11) NOT NULL AUTO_INCREMENT, user_id int(11) NOT NULL, user_type_id int(11) NOT NULL,  PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (user_type_id) REFERENCES users_types(id) )"},
			{name:'Table categories', sql: "CREATE TABLE categories ( id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, PRIMARY KEY (id) )"},
			{name:'Table taxes', sql: "CREATE TABLE taxes ( id int(11) NOT NULL AUTO_INCREMENT, tax decimal(2,2), PRIMARY KEY (id))"},
			{name:'Table products', sql: "CREATE TABLE products ( id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, image varchar(255), price double(10,2) NOT NULL, quantity int(4) NOT NULL, assessment INT(1) NOT NULL DEFAULT 1, sales_quantity INT(5) NOT NULL DEFAULT 0, category_id int(11) NOT NULL, tax_id int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (category_id) REFERENCES categories(id), FOREIGN KEY (tax_id) REFERENCES taxes(id) )"},
			{name:'Table orders_states', sql: "CREATE TABLE orders_states ( id int(11) NOT NULL AUTO_INCREMENT, state varchar(50) NOT NULL, PRIMARY KEY (id) )"},
			{name:'Table orders', sql: "CREATE TABLE orders ( id int(11) NOT NULL AUTO_INCREMENT, total_products int(3), tax_amount decimal(10,2) NOT NULL, subtotal decimal(10,2) NOT NULL, total double(10,2) NOT NULL, user_id int(4) NOT NULL, state_id int(10) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (state_id) REFERENCES orders_states(id) )"},
			{name:'Table orders_items', sql: "CREATE TABLE orders_items ( id int(11) NOT NULL AUTO_INCREMENT, product_id int(10) NOT NULL, quantity int(10) NOT NULL, tax_amount decimal(10,2) NOT NULL, subtotal decimal(10,2) NOT NULL, total decimal(10,2) NOT NULL, order_id int(10), PRIMARY KEY (id), FOREIGN KEY (order_id) REFERENCES orders(id), FOREIGN KEY (product_id) REFERENCES products(id) )"},
			{name:'Table home_products', sql: "CREATE TABLE home_products ( id int(2) NOT NULL AUTO_INCREMENT, product_id int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (product_id) REFERENCES products(id))"},
			{name:'Table home_info', sql: "CREATE TABLE home_info ( id int(2) NOT NULL AUTO_INCREMENT, mision TEXT NOT NULL, history TEXT NOT NULL, vision TEXT NOT NULL, PRIMARY KEY (id) )"}
		];

		// Genero las tablas
		for (let i = 0; i < tables.length; i++) {
			const log = await querySync(tables[i].sql, tables[i].name).then(r => r).catch(err => {throw err});
			console.log(log);
		}

		// contraseña por defecto de los usarios de prueba
		const password = 'manager';

		// precarga de datos en la BD
		const seeds = [
	
			// creando los tipos de usuarios
			[
				{name:'type admin', sql: `INSERT INTO users_types (type) VALUES ('administrator')`},
				{name:'type client', sql: `INSERT INTO users_types (type) VALUES ('Client')`},
			],

			// creando usuarios
			[
				{name:'Admin Jesus', sql: `INSERT INTO users (name, lastname, email, password) VALUES ('Jesus','Rogliero','rogliero@admin.com','${await genHash(password)}')`},
				{name:'Admin hector', sql: `INSERT INTO users (name, lastname, email, password) VALUES ('Hector','Perez','perez@admin.com','${await genHash(password)}')`},
			],

			// estableciendo los tipos a los usuarios de prueba
			[
				{name:'Admin type for jesus', sql: `INSERT INTO users_types_users (user_id, user_type_id) VALUES (1, 2)`},
				{name:'Admin type for hector', sql: `INSERT INTO users_types_users (user_id, user_type_id) VALUES (2, 2)`},
			],
		
			// creando categorias
			[
				{name:'Category 1', sql: "INSERT INTO categories (name) VALUES ('Categoria 1')"},
				{name:'Category 2', sql: "INSERT INTO categories (name) VALUES ('Categoria 2')"},
				{name:'Category 3', sql: "INSERT INTO categories (name) VALUES ('Categoria 3')"},
				{name:'Category 4', sql: "INSERT INTO categories (name) VALUES ('Categoria 4')"},
			],

			// creando los estados de los pedidos
			[
				{name:'pending status', sql: "INSERT INTO orders_states (state) VALUES ('pending')"},
				{name:'generated status', sql: "INSERT INTO orders_states (state) VALUES ('generated')"},
				{name:'paid status', sql: "INSERT INTO orders_states (state) VALUES ('paid')"},
			],
			
			// creando los impuestos
			[
				{name:'Tax 1', sql: "INSERT INTO taxes (tax) VALUES (0.16)"},
			],
			
			// creando productos
			[
				{name:'product 1', sql: "INSERT INTO products (name, image, price, quantity, category_id, tax_id, assessment) VALUES ('Tacones Rosas', 'img/pic2.png', 75.66, 3, 1, 1, 1 )"},
				{name:'product 2', sql: "INSERT INTO products (name, image, price, quantity, category_id, tax_id, assessment) VALUES ('Mochila Moderna', 'img/pic12.png', 6.99, 1, 3, 1, 3 )"},
				{name:'product 3', sql: "INSERT INTO products (name, image, price, quantity, category_id, tax_id, assessment) VALUES ('Zapatos Deportivos', 'img/pic8.png', 24.99, 4, 2, 1, 4 )"},
				{name:'product 4', sql: "INSERT INTO products (name, image, price, quantity, category_id, tax_id, assessment) VALUES ('Chaqueta Deportiva', 'img/pic4.png', 17.45, 10, 4, 1,2 )"},
				{name:'product 5', sql: "INSERT INTO products (name, image, price, quantity, category_id, tax_id, assessment) VALUES ('Laptop', 'img/product1.jpg', 349.99, 1, 1, 1, 5 )"},
			],


			// creando los home products
			[
				{name:'Home_product 1', sql: "INSERT INTO home_products (product_id) VALUES (1)"},
				{name:'Home_product 2', sql: "INSERT INTO home_products (product_id) VALUES (2)"},
				{name:'Home_product 3', sql: "INSERT INTO home_products (product_id) VALUES (3)"},
				{name:'Home_product 4', sql: "INSERT INTO home_products (product_id) VALUES (4)"},
			],
		
		];
		
		// recorriendo cada array para insertar los datos
		for (let i = 0; i < seeds.length; i++) {
		
			for (let j = 0; j < seeds[i].length; j++) {
				
				const log = await querySync(seeds[i][j].sql, seeds[i][j].name).then(r => r).catch(err => {throw err});
				console.log(log);
			}
			
		}
	
		connection.end();
	}
	
	
	seed();

} catch (error) {
	console.error(error);
}







