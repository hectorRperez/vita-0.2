
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

            if( req.body.password != req.body.password_confirm){
                done("Las contraseñas no coinciden", false);
            }
                
            

            // encrypto la contraseña
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                if(err) throw done(err.sqlMessage, false);
                
                //defino la consulta sql
                const values = [req.body.name, req.body.lastname, req.body.email, hash];
                const sql = 'INSERT INTO users (name, lastname, email, password) VALUES (?,?,?,?)';

                // guardo los datos del usuario en la BD
                connection.query(sql, values, function (err, results, fields) {
                    if(err) throw done(err, false);
                    
                    // si la insercion fue correcta serializo los datos
                    if(results.affectedRows > 0) {
                        done(null, {
                            id: results.insertId,
                            name : req.body.name,
                            lastname: req.body.lastname,
                            email: req.body.email
                        });
                    }

        
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
        connection.query('SELECT id, name, lastname, email FROM `users` WHERE `id` = ?', [id], function (err, results, fields) {
            if(err) throw err.sqlMessage;

            if(results[0] != null){
                done(null, results[0] );
            }
    
        });
    });

};