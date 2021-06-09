const config = require('./config.js');
const mysql = require('mysql');

const connection = mysql.createConnection(config.mysql);

module.exports = connection;