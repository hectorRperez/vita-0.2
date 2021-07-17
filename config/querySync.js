const connection = require("./connection");

module.exports = function (sql, values) {
    return new Promise( function(resolve, reject) {
        connection.query(sql, values, (error, results, fields) => {
            if(error) return reject(error);
            
            return resolve(results);
        });
    });
}