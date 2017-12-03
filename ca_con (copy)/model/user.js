var connection = require('../config/db')

function model() {}



model.prototype.insert_ca = function (data,table,callback) {
    if (!data){
        callback(false)
    }else {
        var query = 'INSERT INTO '+table+' SET ?';
        var set_auto="ALTER TABLE "+table+" AUTO_INCREMENT = 1";
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


model.prototype.check_exist = function (user,table) {
    return new Promise(function (resolve, reject) {
        var query = 'SELECT * FROM '+table+' WHERE user =?';
        connection.query(query,user,function (error,result) {
            if (error){
                reject(error)
            }else {
                resolve(result)
            }
        })
    })

}




model.prototype.update_user_IC = function(ic,user,callback) {
    var query = "UPDATE user SET IC = '"+ic+"' WHERE user = '"+user+"'";
    connection.query(query,function (error,result) {
        if (error){
            callback(error)
        }else {
            callback(error,result)
        }
    })
}


model.prototype.get_user = function(where,callback) {
    var query = 'SELECT * FROM user WHERE '+where
    connection.query(query,function (error,result) {
        if (error){
            callback(error)
        }else {
            callback(error,result)
        }
    })
}


model.prototype.update_uer = function (data_update,where,callback) {
    if (!data_update || !where){
        callback(false)
    }else {
        var sql = "UPDATE user SET ? WHERE " + where;
        connection.query(sql,data_update,function (error,result) {
            if (error){
                callback(error)
            }else {
                callback(error,result)
            }
        })
    }
}



var model = new model()
module.exports = model