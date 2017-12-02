var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "CA_TT"

});

function insert_ca (data,callback) {
    if (!data){
        callback(false)
    }else {
        var query = 'INSERT INTO CA_con SET ?';
        var set_auto="ALTER TABLE CA_con AUTO_INCREMENT = 1";
        connection.query(set_auto,function (error,result) {
            if (error){
                callback(error)
            }else {
                connection.query(query,data,function (error,result) {
                    if (error){
                        callback(error)
                    }else {
                        callback(error,result)
                    }
                })
            }
        })
    }
}

function get_All(callback) {
    var query = 'SELECT * FROM CA_con';
    connection.query(query,function (error,result) {
        if (error){
            callback(error)
        }else {
            callback(error,result)
        }
    })
}

function delete_id(id,callback) {
    var query = "DELETE FROM CA_con WHERE Identity=?";
    connection.query(query,id,function (error,result) {
        if (error){
            callback(error)
        }else {
            callback(error,result)
        }
    })
}

function check_exist_user(id,callback){
    var query = "SELECT * FROM CA_con WHERE Identity=?";
    connection.query(query,id,function (error,result) {
        if (error){
            callback(error)
        }else {
            callback(error,result)
        }
    })
}


module.exports = connection
module.exports.insert_ca = insert_ca
module.exports.get_All = get_All
module.exports.delete_id = delete_id
module.exports.check_exist_user = check_exist_user