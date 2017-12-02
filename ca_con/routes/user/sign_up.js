var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var randomstring = require("randomstring");
var model = require('../../model/user')
var send_mail = require('../../help/send_mail')
var help = require('../../help/help')

/* GET home page. */

router.get('/sign_up',function (req,res,next) {
    var url = help.fullUrl(req,'')
    res.render('sign_up',{url:url});
})

router.post('/sign_up',function (req,res,next) {
    var email = req.body.email
    var thongtin = req.body.tt
    var password = randomstring.generate(8)
    model.check_exist(email,'user').then(function (resolve, reject) {
        if(resolve.length==0){
            var radom = crypto.randomBytes(32).toString('hex');
            var password_hash = help.generateHash(password)
            model.insert_ca({user:email,password:password_hash,	check_login:radom,thongtin:	thongtin},'user',function (error,result) {
                if(result){
                    send_mail.send_Mail(email,password,'password',function (error,result) {
                        if(result){
                            res.json(true)
                        }
                    })
                }
            })

        }else {
            res.json(false)
        }
    })


})


module.exports = router;
