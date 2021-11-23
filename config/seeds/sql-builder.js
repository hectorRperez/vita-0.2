const moment = require("moment");

const SqlBuilder = () => ({
  getStringValue: function (value) {
    if (typeof value == "string") return `'${value}'`;
    else if (typeof value == "number") return `${value}`;
    else if (value instanceof Date) {
      const date = moment(value).format("YYYY-MM-DD HH:mm:ss");
      return `'${date}'`;
    }
    throw new Error("Tipo de valor no encontrado.");
  },

  getQueryInsertTable: function (nameTable, data) {
    let columns = "";
    let values = "";

    if (!data) throw new Error("No hay valores asociados");
    if (!nameTable) throw new Error("Sin nombre de la tabla");

    for (const index in data) {
      if (columns && values) {
        columns += ", ";
        values += ", ";
      }
      columns += index;
      values += this.getStringValue(data[index]);
    }

    const query = `INSERT INTO ${nameTable} (${columns}) VALUES (${values})`;
    return query;
  },
});

// exportando un objeto que se encarga de las consultas
const sqlBuilder = SqlBuilder();
module.exports = sqlBuilder;
