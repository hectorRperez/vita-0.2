const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const queryBuilder = require("../config/queryBuilder.js");
const connection = require('../config/connection');
const { throws } = require('assert');


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


// ruta que se encarga de crear un producto
router.post('/create_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {
    try {
      const {file, body} = req; 

      // validaciones de formulario ---------

      if(body.name == "" )
        throw "El nombre del producto es obligatorio";

      if(body.price == "" )
        throw "El precio del producto es obligatorio";

      if( isNaN(body.price) )
      throw "El precio del producto no es correcto";
      
      if( isNaN(body.quantity) || body.quantity == "" )
        throw "Ingrese una cantidad correcta";
        
      if( isNaN(body.category_id) )
        throw "Ingrese una categoria correcta";

      if(body.category_id == "" )
      throw "La categoria es obligatoria";
      
      let route_image = null
      if(file != null && file != undefined){
        route_image = `img/${file.filename}`;
      }
      //------------------------------------------
      

      // defino la consulta y los valores que se va a guardar
      let sql = "INSERT INTO products (image, name, price, quantity, category_id) VALUES (?,?,?,?,?)";
      let values = [ route_image, body.name, body.price, body.quantity, body.category_id]

      // ejecuto la consulta
      connection.query(sql,values, function (err, result) {
        if (err) throw err;
        console.log("agregado correctamente");
      });

      res.redirect('get_products');
    

    } catch (error) {

      res.send(error);
    }
    
});


// ruta que se encarga de actualizar un producto
router.post('/update_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, (req, res) => {
    try {
      const { body } = req;

      // valido que se envien los datos correctos
      // validaciones de formulario ---------

      if(body.name == "" )
        throw "El nombre del producto es obligatorio";

      if(body.price == "" )
        throw "El precio del producto es obligatorio";

      if( isNaN(body.price) )
      throw "El precio del producto no es correcto";
      
      if( isNaN(body.quantity) || body.quantity == "" )
        throw "Ingrese una cantidad correcta";
        
      if( isNaN(body.category_id) )
        throw "Ingrese una categoria correcta";

      if(body.category_id == "" )
      throw "La categoria es obligatoria";
      
      //------------------------------------------


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
    } catch (error) {
        res.send(error);
    }

});


// ruta que se carga de eliminar un producto
router.post('/delete_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {

    try {
    	const { body } = req;

		// busco la informacion de la imagen
		connection.query("SELECT image FROM products WHERE id = ?", [body.product_id], function(err, results, fields) {

			if(results === undefined || results === null) {
				throw "El producto no existe";
			}
			
			// defino la consulta sql
			const sql = "DELETE FROM products WHERE id = ?";

			// ejecuto la consulta
			connection.query(sql, [body.product_id], function (err, results, fields) {
				if (err) throw err;
        
			if(results.affectedRows === 1) {
				// elimino el archivo si se elimino el producto
				fs.unlinkSync( path.join("public/", results[0].image ) );
			}

			});

		});

    	res.redirect('get_products'); 
    
    } catch (error) {
    	res.send(error);
    }



});




module.exports = router;