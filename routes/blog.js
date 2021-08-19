const router = require('express').Router();
const queryBuilder = require('../config/queryBuilder.js');
const {querySync} = require('../config/querySync.js');
const path = require("path");
const fs = require('fs');

// ruta inicial
router.get('/blog', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {
   
	try {
		let params = {};

		// defino los selects
		params.selects = [
			{field: 'id', condition: 'posts.id'},
			{field: 'title', condition: 'posts.title'},
			{field: 'content', condition: 'posts.content'},
			{field: 'image', condition: 'posts.image'},
			{field: 'user', condition: 'users.name'},
			{field: 'created_at', condition: 'posts.created_at'},
		];

		// defino los joins
		params.joins = [
			{type: 'INNER', join: ['users', 'users.id', '=', 'posts.user_id'] },
		];

		// consulto
		let posts = await queryBuilder('posts', params).catch( err => {throw err} );

		console.log(posts);

		res.render('blog.ejs', {posts: posts, user: req.user});


	} catch (error) {
		console.error(error);
	}

});



router.get('/new_post', (req, res, next) => {
	
	if( req.isAuthenticated() ) return next();
	
	res.redirect("/login");

}, async (req, res) => {
   
	try {
		res.render('new_post.ejs');
	} catch (error) {
		console.error(error);
	}

});




// ruta que se encarga de crear un post
router.post('/new_post', async (req, res, next) => {
	
	// verifico que este autenticado
	  if( req.isAuthenticated() ) {
  
	  // busco si el usuario tiene permiso de ver esta vista
	  const sql = 'SELECT * FROM users_types_users WHERE user_id = ? AND user_type_id = ?';
	  const values = [req.user.id, 1];
	  let user_type = await querySync(sql, values).catch(e => {throw e});
  
	  // sui tiene permiso continua
	  if(user_type.length != 0)
		return next();
	 
	} 
	  // sino solo redirige
	  res.redirect("/login");
  
  }, async (req, res) => {
	 
	  try {
		  const {files, body} = req; 
  
			// validaciones de formulario ---------

			if(body.title == "" ) throw "El titulo del post es obligatorio";
			if(body.content == "" ) throw "El contenido del post es obligatorio";
			
			//------------------------------------------

			let image = path.join("img/posts/" + files[0].filename);

			let sql = "INSERT INTO posts (title, content, image, user_id, created_at) VALUES (?,?,?,?, NOW())";
			const result = await querySync(sql, [body.title, body.content, image, req.user.id]).catch(e => {throw e});

			res.redirect('/blog');
  
	  } catch (e) {
		console.error(e);
	  }
	  
  });


// ruta que se carga de eliminar un producto
router.post('/delete_post', async (req, res, next) => {
	
	// verifico que este autenticado
	  if( req.isAuthenticated() ) {
  
	  // busco si el usuario tiene permiso de ver esta vista
	  const sql = 'SELECT * FROM users_types_users WHERE user_id = ? AND user_type_id = ?';
	  const values = [req.user.id, 1];
	  let user_type = await querySync(sql, values).catch(e => {throw e});
  
	  // sui tiene permiso continua
	  if(user_type.length != 0)
		return next();
	 
	} 
	  // sino solo redirige
	  res.redirect("/login");
  
  }, async (req, res) => {
  
	try {
		const { body } = req;
  
		// busco el post
		const post =  await querySync("SELECT id, image FROM posts WHERE id = ?", [body.id] ).then(r => r[0]).catch(e => {throw e});
  
		// verifico si hay un post
		if(post.id === undefined || post.id === null) 
			throw "El post no existe";

		// busco el post
		const resul =  await querySync("DELETE FROM posts WHERE id = ?", [body.id] ).catch(e => {throw e});

		fs.unlinkSync( path.join("public/", post.image ) );
  
		res.redirect('/blog'); 
	  
	} catch (e) {
		console.error(e);
	}
  
  });
  

module.exports = router;
