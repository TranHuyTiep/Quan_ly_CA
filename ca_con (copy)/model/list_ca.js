var connection = require('../config/db')

function model() {}

model.prototype.insert_listCA = function (data) {
  return new Promise ((resolve,reject) => {
    var query = 'INSERT INTO list_ca SET ?';
    var set_auto="ALTER TABLE list_ca AUTO_INCREMENT = 1";
    connection.query(set_auto,function (error,result) {
        if (error){
            reject(error)
        }else {
            connection.query(query,data,function (error,data) {
                if (error){
                    reject(error)
                }else {
                    resolve(data)
                }
            })
        }
    })
  })
}

model.prototype.check_exist = function (id_ca) {
    return new Promise(function (resolve, reject) {
        var query = 'SELECT * FROM list_ca WHERE Identity =?';
        connection.query(query,id_ca,function (error,result) {
            if (error){
                reject(error)
            }else {
                resolve(result)
            }
        })
    })

}


model.prototype.delete_ca = function (id_ca) {
    return new Promise(function (resolve, reject) {
        var query = 'DELETE FROM list_ca WHERE Identity=?';
        connection.query(query,id_ca,function (error,result) {
            if (error){
                reject(error)
            }else {
                resolve(result)
            }
        })
    })

}


model.prototype.insert_CA = function (data) {
    return new Promise ((resolve,reject) => {
      var query = 'INSERT INTO list_ca SET ?';
      var set_auto="ALTER TABLE list_ca AUTO_INCREMENT = 1";
      connection.query(set_auto,function (error,result) {
          if (error){
              reject(error)
          }else {
              connection.query(query,data,function (error,reult) {
                  if (error){
                      reject(error)
                  }else {
                      resolve(reult)
                  }
              })
          }
      })
    })
  }

var model = new model()



module.exports = model