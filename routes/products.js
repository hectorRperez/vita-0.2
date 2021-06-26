const express = require('express');
const router = express.Router();
const queryBuilder = require("../config/queryBuilder.js");
const connection = require('../config/connection');


// ruta que se carga de traer los productos
router.get('/get_products', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {

    // obtengo los parametros
    let params = req.body;

    // defino los selects
    params.selects = [ 
        {field: 'id', condition: 'products.id'},
        {field: 'name', condition: 'products.name'},
        {field: 'image', condition: 'products.image'},
        {field: 'quantity', condition: 'products.quantity'},
        {field: 'price', condition: 'products.price'},
        {field: 'category', condition: 'categories.name'},
        {field: 'assessment', condition: 'products.assessment'},
        {field: 'sales_quantity', condition: 'products.sales_quantity'}
    ];

    // defino los joins
    params.joins = [
        {type: 'INNER', join: ['categories', 'products.category_id', '=', 'categories.id'] }
    ];

    // realizo la consulta
    const results = await queryBuilder('products', params);

    res.render('products', {products: results, user: req.user});

});


// ruta que se carga de traer los productos
router.post('/create_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {

    const {file, body} = req; 

    if( isNaN(body.price) || body.price == undefined )
      throw "Ingresa un precio valido";
    
    if( isNaN(body.quantity) ||body.quantity == undefined )
      throw "Ingrese una cantidad correcta";
      
    if(body.category_id == undefined)
      throw "Ingrese una categoria";

    let route_image = "";
    if(file == undefined)
      route_image = `img/${file.filename}`;

    // defino la consulta y los valores que se va a guardar
    let sql = "INSERT INTO products (image, name, price, quantity, category_id) VALUES (?,?,?,?,?)";
    let values = [ route_image, body.name, body.price, body.quantity, body.category_id]

    // ejecuto la consulta
    connection.query(sql,values, function (err, result) {
      if (err) throw err;
      console.log("agregado correctamente");
    });

   // res.render('products', {products: results, user: req.user});
   res.redirect('get_products');


});


// ruta que se carga de traer los productos
router.post('/update_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, (req, res) => {
    const { body } = req;

    // valido que se envien los datos correctos

    if(isNaN(body.price))
      throw "Ingrese un precio valido";

    if(isNaN(body.quantity))
      throw "Ingrese una cantidad valida";
    
    if(isNaN(body.category_id))
      throw "Ingrese una categoria correcta";


    // defino la consulta sql
    const sql = "UPDATE products SET name = ?, price = ?, quantity = ?, category_id = ? WHERE id = ?";
    const values = [body.name, body.price, body.quantity, body.category_id, body.id];

    // ejecuto la consulta
    connection.query(sql, values, function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    });

   // res.render('products', {products: results, user: req.user});
   res.redirect('get_products');

});


// ruta que se carga de eliminar un producto
router.post('/delete_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, (req, res) => {
    const { body } = req;

    // defino la consulta sql
    const sql = "DELETE FROM products WHERE id = ?";

    console.log(body.product_id);

    // ejecuto la consulta
    connection.query(sql, [body.product_id], function (err, result) {
      if (err) throw err;
    });

   // res.render('products', {products: results, user: req.user});
   res.redirect('get_products');

});




module.exports = router;