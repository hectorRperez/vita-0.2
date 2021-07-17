const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const queryBuilder = require("../config/queryBuilder.js");
const querySync = require("../config/querySync.js");
const connection = require('../config/connection');


// ruta que se carga de traer los productos
router.get('/get_products/:page?', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {

    const {body, params} = req;

    // obtengo los parametros
    let data = body;

    // la pagina a mostrar
    data.page = req.params.page;

    // defino los selects
    data.selects = [ 
        {field: 'id', condition: 'products.id'},
        {field: 'name', condition: 'products.name'},
        {field: 'image', condition: 'products_images.image'},
        {field: 'quantity', condition: 'products.quantity'},
        {field: 'price', condition: 'products.price'},
        {field: 'assessment', condition: 'products.assessment'},
        {field: 'sales_quantity', condition: 'products.sales_quantity'}
    ];

    data.joins = [
      {type: "INNER", join: ["products_images", 'products_images.product_id', '=', 'products.id'] }
    ];

    // realizo la consulta
    const results = await queryBuilder('products', data);

    let num_items = await querySync('select count(name) as quantity from products', null);
    num_items = num_items[0].quantity / 20;

    res.render('products', {products: results, pagination_items: num_items,  user: req.user});

});


// ruta que se encarga de crear un producto
router.post('/create_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {
   
	try {
		const {files, body} = req; 

		console.log(files);
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
		

		// defino la consulta y los valores que se va a guardar
		let sql = "INSERT INTO products (name, price, quantity, category_id) VALUES (?,?,?,?)";
		const result = await querySync(sql, [body.name, body.price, body.quantity, body.category_id]).catch(error => {throw error});


		for (let i = 0; i < files.length; i++) {

			let image = `img/${files[i].filename}`;
			sql = "INSERT INTO products_images (product_id, image, is_first) VALUES (?,?,?)"
			await querySync(sql, [result[0].insertId], image, i == 0).catch(error => {throw error});
		}

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