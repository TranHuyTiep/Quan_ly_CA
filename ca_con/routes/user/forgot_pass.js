var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var randomstring = require("randomstring");
var model = require('../../model/user')
var send_mail = require('../../help/send_mail')
var help = require('../../help/help')

/* GET home page. */

router.get('/forgotPassword',function (req,res,next) {
    var url = help.fullUrl(req,'')
    res.render('user/forgot_password',{url:url});
})

router.post('/forgotPassword',function (req,res,next) {
    var email = req.body.email
    model.check_exist(email,'user').then(function (result,error) {

        if (result){
            var check = result[0].check_login
            var fullUrl = help.fullUrl(req,'user/forgotPassword/change/'+check)
            send_mail.send_Mail(email,fullUrl,'Quên mật khẩu!',function (result, error) {

            })
            res.json(true)
        }
    })

})

router.get('/forgotPassword/change/:id',function (req,res,next) {
    var check = req.params.id
    var url = (help.fullUrl(req,''))
    var sql = 'check_login = "'+check+'"'
    model.get_user(sql,function (error,result) {
        if(result.length!=0){
            res.render('user/change_password_forgot',{'url':url})
        }else {
            res.redirect('/user/forgotPassword')
        }
    })
})


router.post('/forgotPassword/change',function (req,res,next) {
    var new_pass = req.body.new_pass
    var email =  req.body.email

    var sql = 'user = "'+email+'"'
    model.get_user(sql,function (error,result) {
        if(result.length!=0){
            var radom = crypto.randomBytes(32).toString('hex');
            var data = {
                check_login:radom,
                password : help.generateHash(new_pass)
            }

            model.update_uer(data,sql,function (error,result) {
                if(!error){
                    res.json({success:true})
                }
            })

        }else {
            res.json({email:false})
        }
    })

})


module.exports = router;
