'use strict'

const router = require('express').Router();
const queryBuilder = require("../config/queryBuilder.js");

// ruta que se carga si el usuario ha iniciado sesion
router.get('/shop:product_id?', (req, res, next) => {


	if( req.isAuthenticated() ) return next();
	
	// guardo la peticion en una cookie para depues continuar al estar autenticado
	if(req.params.product_id != undefined || req.params.product_id != null) {
		res.cookie('shop_product', req.params.product_id, { expires: new Date(Date.now() + 30000), httpOnly: true });
	}

	res.redirect("/login");

}, async (req, res) => {

	try {
		let product_id = null;

		if(req.params.product_id != undefined || req.params.product_id != null) {
			product_id = req.params.product_id;
		}else if(req.cookies.shop_product != undefined || req.cookies.shop_product != null){
			product_id = req.cookies.shop_product;
		}


		let params = {};

		// defino los selects
		params.selects = [
			{field: 'id', condition: 'products.id'},
			{field: 'name', condition: 'products.name'},
			{field: 'price', condition: 'products.price'},
			{field: 'image', condition: 'products_images.image'},
			{field: 'description', condition: 'products.description'},
			{field: 'category_id', condition: 'products.category_id'}
		];

		params.joins = [
			{type: "INNER", join: ["products_images", 'products_images.product_id', '=', 'products.id'] }
		];

		params.where = [
			['products.id', '=', product_id],
			['products_images.is_first', '=', 1]

		];

		let product = await queryBuilder('products', params).then( r => r[0] ).catch( err => {throw err} );

		params = {};

		// defino los selects
		params.selects = [
			{field: 'image', condition: 'products_images.image'},
			{field: 'is_first', condition: 'products_images.is_first'}
		];

		params.where = [
			['products_images.product_id', '=', product_id]
		];

		let product_images = await queryBuilder('products_images', params).catch( err => {throw err} );



		params = {};

		// defino los selects
		params.selects = [
			{field: 'name', condition: 'products.name'},
			{field: 'price', condition: 'products.price'},
			{field: 'image', condition: 'products_images.image'},
			{field: 'description', condition: 'products.description'}
		];

		
		params.joins = [
			{type: "INNER", join: ["products_images", 'products_images.product_id', '=', 'products.id'] }
		];

		params.where = [
			['products.category_id', '=', product.category_id],
			['products.id', '<>', product.id],
			['products_images.is_first', '=', 1]
		];

		let products_related = await queryBuilder('products', params).catch( err => {throw err} );

		res.render('shop', {user: req.user, product: product, product_images: product_images, products_related: products_related});
	} catch (error) {
		console.error(error);
	}
});




module.exports = router;