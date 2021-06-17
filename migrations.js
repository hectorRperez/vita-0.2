'use strict'

// obtengo la connexion;
let connection = require('./connection.js');

const tables = [
	{name:'Drop all table', sql: "DROP TABLE IF EXISTS products, categories, users_types_users, users, users_types"},
	{name:'users', sql: "CREATE TABLE users ( id int(11) NOT NULL AUTO_INCREMENT, full_name varchar(50) NOT NULL, email varchar(255) NOT NULL, password varchar(255) NOT NULL, PRIMARY KEY (id) )"},
	{name:'users_types', sql: "CREATE TABLE users_types ( id int(11) NOT NULL AUTO_INCREMENT, type varchar(50) NOT NULL, PRIMARY KEY (id))"},
	{name:'users_types_users', sql: "CREATE TABLE users_types_users ( id int(11) NOT NULL AUTO_INCREMENT, user_id int(11) NOT NULL, user_type_id int(11) NOT NULL,  PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (user_type_id) REFERENCES users_types(id) )"},
	{name:'categories', sql: "CREATE TABLE categories ( id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, PRIMARY KEY (id) )"},
	{name:'products', sql: "CREATE TABLE products ( id int(11) NOT NULL AUTO_INCREMENT, name varchar(50) NOT NULL, price double(11,2) NOT NULL, quantity int(4) NOT NULL, assessment INT(1) NOT NULL DEFAULT 0, sales_quantity INT(5) NOT NULL DEFAULT 0, category_id int(11) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (category_id) REFERENCES categories(id) )"},
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

connection.end();


