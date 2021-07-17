const router = require("express").Router();
const queryBuilder = require("../config/queryBuilder.js");

// ruta que se carga de traer los productos
router.get('/skincare', async (req, res) => {
   
	let params = {};

	// defino los selects
	params.selects = [
        {field: 'id', condition: 'products.id'},
		{field: 'name', condition: 'products.name'},
		{field: 'image', condition: 'products_images.image'},
		{field: 'price', condition: 'products.price'},
		{field: 'assessment', condition: 'products.assessment'},
	];

    // defino los joins
    params.joins = [
		{type: "INNER", join: ["products_images", 'products_images.product_id', '=', 'products.id'] }
    ];

    // solo se muestra la imagen principal
	params.where = [
		['products_images.is_first', '=', 1]
	];

	let products = await queryBuilder('products', params);


	res.render('skincare', {products: products});

});

module.exports = router;