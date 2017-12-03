var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ca_con"

});

module.exports = connection