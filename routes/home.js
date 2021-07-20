const queryBuilder = require('../config/queryBuilder');

const router = require('express').Router();

// ruta inicial
router.get('/', async (req, res) => {
   

	try {
		let params = {};

		// defino los selects
		params.selects = [
			{field: 'name', condition: 'products.name'},
			{field: 'image', condition: 'products_images.image'},
			{field: 'price', condition: 'products.price'},
			{field: 'assessment', condition: 'products.assessment'},
		];

		// defino los joins
		params.joins = [
			{type: 'INNER', join: ['products', 'home_products.product_id', '=', 'products.id'] },
			{type: "INNER", join: ["products_images", 'products_images.product_id', '=', 'products.id'] }
		];

		params.where = [
			['products_images.is_first', '=', 1]
		];

		// establezco el limite de filas a mostrar
		params.limit = 4;

		// consulto los productos
		let products = await queryBuilder('home_products', params).catch( err => {throw err} );

		res.render('index.ejs', {products: products, user: req.user});


	} catch (error) {
		console.error(error);
	}

});

module.exports = router;
