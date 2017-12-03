var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var randomstring = require("randomstring");
var model = require('../../model/user')
var send_mail = require('../../help/send_mail')
var help = require('../../help/help')

/* GET home page. */

router.get('/changePassword',help.isLoggedIn,function (req,res,next) {
    var url=help.fullUrl(req,'')
    res.render('user/change_password',{url:url});
})

router.post('/changePassword',help.isLoggedIn,function (req,res,next) {
    var email = req.body.email
    var old_pass = req.body.old_pass
    var new_pass = req.body.new_pass
    var sql = 'user = "'+email+'"'
    model.get_user(sql,function (error,result) {
        if(result.length ==1){
           if (help.validPassword(old_pass,result[0].password)){
               var password_hash = help.generateHash(new_pass)
               var data = {password:password_hash}
               model.update_uer(data,sql,function (error,result) {
                   if(!error){
                       req.logout();
                       res.json(true)
                   }
               })
           }
        }
    })

})


module.exports = router;
