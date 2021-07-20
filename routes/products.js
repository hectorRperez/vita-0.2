const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const queryBuilder = require("../config/queryBuilder.js");
const {querySync, beginTransaction, commit, rollback} = require("../config/querySync.js");


// ruta que se carga de traer los productos
router.get('/get_products:page?', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {

    const {body, params} = req;

    try {

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

      data.where = [
        ['products_images.is_first', '=', 1]
      ];

      // realizo la consulta
      const results = await queryBuilder('products', data);

      let num_items = await querySync('select count(name) as quantity from products', null);
      num_items = num_items[0].quantity / 5;

      res.render('products', {products: results, pagination_items: num_items,  user: req.user});

    } catch (error) {
      console.error(error);
    }

});


// ruta que se encarga de crear un producto
router.post('/create_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {
   
	try {
		const {files, body} = req; 

		// validaciones de formulario ---------

		if(body.name == "" )
		throw "El nombre del producto es obligatorio";

		if(body.price == "" )
		throw "El precio del producto es obligatorio";

    
		if(body.description == "" )
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

    await beginTransaction();

		// defino la consulta y los valores que se va a guardar
		let sql = "INSERT INTO products (name, description, price, quantity, category_id) VALUES (?,?,?,?,?)";
		const result = await querySync(sql, [body.name, body.description, body.price, body.quantity, body.category_id]).catch(error => {throw error});

    // defino las imagenes del producto
		for (let i = 0; i < files.length; i++) {

			let image = `img/${files[i].filename}`;
			sql = "INSERT INTO products_images (product_id, image, is_first) VALUES (?,?,?)"
			await querySync(sql, [result.insertId, image, i == 0]).catch(error => {throw error});
		}

    await commit();

		res.redirect('get_products');


    } catch (error) {
      await rollback();

      console.error(error);
    }
    
});


// ruta que se encarga de actualizar un producto
router.post('/update_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {
    try {
      const { body } = req;

      // valido que se envien los datos correctos
      // validaciones de formulario ---------

      if(body.name == "" ) throw "El nombre del producto es obligatorio";

      if(body.price == "" ) throw "El precio del producto es obligatorio";

      if( isNaN(body.price) ) throw "El precio del producto no es correcto";
      
      if( isNaN(body.quantity) || body.quantity == "" ) throw "Ingrese una cantidad correcta";
        
      if( isNaN(body.category_id) ) throw "Ingrese una categoria correcta";

      if(body.category_id == "" ) throw "La categoria es obligatoria";
      
      //------------------------------------------

      // defino la consulta sql
      const sql = "UPDATE products SET name = ?, price = ?, quantity = ?, category_id = ? WHERE id = ?";
      await querySync(sql, [body.name, body.price, body.quantity, body.category_id, body.id] ).catch(e => {throw e});

      res.redirect('get_products');
    
    } catch (e) {
      console.error(e);
    }

});


// ruta que se carga de eliminar un producto
router.post('/delete_product', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {

    try {
    	const { body } = req;

      await beginTransaction();

      // busco el producto
      const product =  await querySync("SELECT id, name FROM products WHERE id = ?", [body.product_id] ).then(r => r[0]).catch(e => {throw e});

      // verifico si hay un producto
      if(product.id == undefined || product.id == null) {
				throw "El producto no existe";
			}

      // obtengo todas las imagenes
      const product_images = await querySync("SELECT * FROM products_images WHERE product_id = ?", [body.product_id] ).catch(e => {throw e});
      
      // elimino las imagenes
      const result = await querySync("DELETE FROM products_images WHERE product_id = ?", [body.product_id] ).catch(e => {throw e});

      // elimino el producto
      const result2 = await querySync("DELETE FROM products WHERE id = ?", [body.product_id] ).catch(e => {throw e});

      if(result.affectedRows < 1) throw "Error al eliminar las imagenes";
      if(result2.affectedRows < 1) throw "Error al eliminar el producto";

      // recorro la lista de imagenes y las voy borrando una a una
      for (let i = 0; i < product_images.length; i++) {
          fs.unlinkSync( path.join("public/", product_images[i].image ) );
      }
      
      await commit();

    	res.redirect('get_products'); 
    
    } catch (e) {
      await rollback();
    	console.error(e);
    }

});




module.exports = router;