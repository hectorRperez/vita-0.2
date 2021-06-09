const connection = require("./connection");


function empty(value) {
    return value == null || value == undefined;
}

// Funcion Encargada de la paginacion de las consultas
module.exports = (table, params) => {

    let limit = empty(params.limit) ? 20 : (params.limit > 20 ? 20 : params.limit);
    let page = empty(params.page) ? 1 : (params.page > 0 ? params.page : 1);
    let offset = ( limit * (page - 1) );
    let order_by = empty(params.order_by) ? [] : params.filters;
    let filters = empty(params.filters) ? [] : params.filters;
    
    // creando los selects
    let selects = "";
    for (let select of params.selects) {
        selects += select.field + " AS " + select.condition + ",";
    }

    // creando los joins
    let join = "";
    for (let j of params.joins) {
        join += `${j.type} join ${j.join[0]} on ${j.join[1]} ${j.join[2]} ${j.join[3]} `;
    }
    
    // creando los where
    let where = "where ";
    let pos = 0;
    for (let w of params.where) {
        
        if( pos > 0){
            where += " and "; 
        }else {
            where += `${w[0]} ${w[1]} ${w[2]}`;
        }

        pos++;
    }

    let group_by = `group by ${params.group_by} `;

    let order_by = `order by ${params.order_by[0]} ${params.order_by[1]}`;

    let sql = "SELECT " + table + " FROM" + table + join + where + group_by;
    console.log(sql);

    connection.query(sql, function (err, results, fields) {
        if(err) throw err.sqlMessage;
        
        if( results[0] )
            return results[0];

        return null;

    });

		
};