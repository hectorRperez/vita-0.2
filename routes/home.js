const queryBuilder = require('../config/queryBuilder');

const router = require('express').Router();

// ruta inicial
router.get('/', async (req, res) => {
   
	/*
	let params = {};

	params.selects = [
		{field: 'history', condition: 'home_info.history'},
		{field: 'mision', condition: 'home_info.mision'},
		{field: 'vision', condition: 'home_info.vision'}
	];

	let info = await queryBuilder('home_info', params);

	let params2 = {};

	// defino los selects
	params2.selects = [
		{field: 'name', condition: 'products.name'},
		{field: 'image', condition: 'products.image'},
		{field: 'price', condition: 'products.price'},
		{field: 'assessment', condition: 'products.assessment'},
	];

    // defino los joins
    params2.joins = [
        {type: 'INNER', join: ['products', 'home_products.product_id', '=', 'products.id'] }
    ];

	// establezco el limite de filas a mostrar
	params2.limit = 4;

	let products = await queryBuilder('home_products', params2);

	res.render('index.ejs', {info: info, products: products});

	*/
	res.render('index.ejs');

});

module.exports = router;
