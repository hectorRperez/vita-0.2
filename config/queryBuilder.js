const connection = require("./connection");

/**
 * Funcion que evalua si una variable esta vacia o nula
 * 
 * @param {any} value 
 * @returns {boolean}
 */
function empty(value) {
    return value == null || value == undefined;
}


/**
 * Funcion encargada de estructurar consultas
 * 
 * @param {string} table 
 * @param {JSON Object} params
 * @returns {JSON Object}
 */
module.exports = (table, params) => {

    // establezco los limites y el punto de partida de la consulta
    let limit = empty(params.limit) ? 20 : (params.limit > 20 ? 20 : params.limit);
    let page = empty(params.page) ? 1 : (params.page > 0 ? params.page : 1);
    let offset = ( limit * (page - 1) );
    
    
    // creando los selects
    let selects = '';
    if( !empty( params.selects) ) {
        
        for (let i = 0; i < params.selects.length; i++) {
            if(i == params.selects.length - 1)
                selects += `${params.selects[i].condition} AS ${params.selects[i].field}`;
            else
                selects += `${params.selects[i].condition} AS ${params.selects[i].field}, `;
        }
    }

    // creando los joins
    let join = '';
    if( !empty(params.joins) ) {
        for (let j of params.joins) {
            join += `${j.type} JOIN ${j.join[0]} on ${j.join[1]} ${j.join[2]} ${j.join[3]} `;
        }
    }

    
    // creando los where
    let where = '';
    if( !empty(params.where) ) {
        where = "WHERE ";
        let pos = 0;
        for (let w of params.where) {
            
            if( pos > 0){
                where += ` AND ${w[0]} ${w[1]} ${w[2]}`;
            }else {
                where += `${w[0]} ${w[1]} ${w[2]}`;
            }
    
            pos++;
        }
    }

    // agrupaciones
    let group_by = '';
    if( !empty(params.group_by) )
        group_by = `group by ${params.group_by}`;
    
    // ordenacion
    let order_by = '';
    if(!empty(params.order_by) )
        order_by = `order by ${params.order_by[0]} ${params.order_by[1]} `;

    // genero la consulta sql
    const sql = `SELECT ${selects} FROM ${table} ${join} ${where} ${group_by} ${order_by} limit ${limit}`;
    

    // envuelvo el metodo query con una promesa para poder obtener los resultado 
    // en una variable diferente

    const result = (sql) => {
        return new Promise((resolve, reject) => {
            connection.query(sql, (error, results, fields) => {
                if(error) return reject(error);
                
                return resolve(results);
            });
        });
    }

    return result(sql).then( result => result ).catch( err => {throw err} );
    
};