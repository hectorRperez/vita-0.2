const express = require('express');
const router = express.Router();
const queryBuilder = require("../config/queryBuilder.js");


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

    console.log(results);

    res.render('products', {products: results, user: req.user});

});




module.exports = router;