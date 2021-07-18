const connection = require("./connection");


// funcion que me permite ejecutar consultas sql
// y obtener los datos en una variable fuera de la funcion query
module.exports = function (sql, values) {
    return new Promise( function(resolve, reject) {
        connection.query(sql, values, (error, results, fields) => {
            if(error) return reject(error);
            
            return resolve(results);
        });
    });
}