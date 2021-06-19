
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require("./config/connection");

module.exports = (passport) => {
    
    // definiendo la estrategia de autenticacion
    passport.use('local', new LocalStrategy({

        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

    }, function(req, email, password, done) {

        // si el usuario esta registrandose
        if(req.body.signup != null) {

            // encrypto la contraseña
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                if(err) throw done(err.sqlMessage, false);
                
                // guardo los datos del usuario en la BD
                connection.query('INSERT INTO users (full_name, email, password) VALUES (?,?,?)', [req.body.full_name, req.body.email, hash], function (err, results, fields) {
                    if(err) throw done(err.sqlMessage, false);
                    
                    if(results.affectedRows > 0)
                        done(null, { id: results.insertId, full_name : req.body.full_name, email: req.body.email } );
        
                });
            });

        // si el usuario esta iniciando sesion
        }else if( req.body.login != null) {

            // consulto los datos del usuario
            connection.query('SELECT * FROM `users` WHERE `email` = ?', [email], function (err, results, fields) {
                if(err) throw done(err.sqlMessage, false);

                if(results[0] != null){
                    
                    // comparo el hash con la contraseña enviada por el usuario
                    bcrypt.compare(password, results[0].password, function(errhash, hashResult) {
                        if(err) done(errhash, false);

                        if(hashResult)
                            done(null, results[0]);
                        else
                            done('verifica tu credenciales');
                    });
                    
                }else {
                    done('Este usuario no ha sido registrado');
                }
        
            });

        }
        

    }));


    // serializacion de un usuario
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserializacion de un usuario
    passport.deserializeUser( function(id,done) {
        connection.query('SELECT id, full_name, email FROM `users` WHERE `id` = ?', [id], function (err, results, fields) {
            if(err) throw err.sqlMessage;

            if(results[0] != null){
                done(null, results[0] );
            }
    
        });
    });

};