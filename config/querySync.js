const connection = require("./connection");
const util = require('util');


// funcion que me permite ejecutar consultas sql
// y obtener los datos en una variable fuera de la funcion query
const querySync = function (sql, values) {
    return new Promise( function(resolve, reject) {
        connection.query(sql, values, (error, results, fields) => {
            if(error) return reject(error);
            
            return resolve(results);
        });
    });
}

const beginTransaction= ()=> { 
    return util.promisify(connection.beginTransaction).call(connection); 
}

const rollback= ()=> {
    return util.promisify(connection.rollback).call(connection)
}

const commit= ()=> {
    return util.promisify(connection.commit).call(connection)
}


module.exports = {
    querySync: querySync,
    beginTransaction: beginTransaction,
    rollback: rollback,
    commit: commit
};