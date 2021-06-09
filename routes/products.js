const express = require('express');
const router = express.Router();

const connection = require('../connection.js');


// ruta que se carga si el usuario ha iniciado sesion
router.get('/get_products', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, (req, res) => {

    let params = req.body;

    params.selects = [ 
        {field: 'id', condition: 'products.id'},
        {field: 'name', condition: 'products.name'},
        {field: 'price', condition: 'products.quantity'},
        {field: 'quantity', condition: 'categories.name'}

    ];


    require("../paginate.js")('products', params);
});




module.exports = router;