
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require("./connection.js");

module.exports = (passport) => {
    
    // definiendo la estrategia de autenticacion
    passport.use('local', new LocalStrategy({

        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

    }, function(req, email, password, done) {
        console.log(req.body);

        if(req.body.signup != null) {

            bcrypt.hash(req.body.password, 10, function(err, hash) {
                if(err) throw err.sqlMessage;
        
                connection.query('INSERT INTO users (full_name, email, password) VALUES (?,?,?)', [req.body.full_name, req.body.email, hash], function (err, results, fields) {
                    if(err) throw err.sqlMessage;
                    
                    if(results.affectedRows > 0)
                        done(null, { id: results.insertId, full_name : req.body.full_name, email: req.body.email } );
        
                });
            });

        }else if( req.body.login != null) {

            connection.query('SELECT * FROM `users` WHERE `email` = ?', [email], function (err, results, fields) {
                if(err) throw err.sqlMessage;

                if(results[0] != null){
                    
                    bcrypt.compare(password, results[0].password, function(errhash, hashResult) {
                        if(err) done(errhash, false);

                        if(hashResult)
                            done(null, results[0]);
                        else
                            done('verifica tu credenciales');
        
                    });
                }
        
            });

        }
        

    }));


    // serializacion de un usuario
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserializacion de usuarios
    passport.deserializeUser( function(id,done) {
        connection.query('SELECT * FROM `users` WHERE `id` = ?', [id], function (err, results, fields) {
            if(err) throw err.sqlMessage;

            if(results[0] != null){
                done(null, results[0] );
            }
    
        });
    });

};