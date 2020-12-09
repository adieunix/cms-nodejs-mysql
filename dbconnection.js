const mysql = require('mysql');
const connection = mysql.createPool({

    host:'localhost',
    user:'root',
    password:'kamikazer99',
    database:'cms_db',
    port:3306,
});

module.exports = connection;
