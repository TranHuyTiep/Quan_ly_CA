var express = require('express');
var router = express.Router();
var bignum = require('bignum');
var ecc = require('../ECC/ECC')
var helper = require('../../help/help')
var fs = require('fs')
var send_mail = require('../../help/send_mail')
var model = require('../../model/user')
var crypto = require('crypto');
var sodium = require('libsodium-wrappers')

/**
 * aead_chacha20poly1305_encrypt
 * @param key : string hex lengh 64
 * @param nonce : string hex lengh 16
 * @param input : string
 * @param sodium
 * @returns {*}
 */
function aead_chacha20poly1305_encrypt(key,nonce,input,sodium) {
    var nonce = sodium.from_hex(nonce)
    key = sodium.from_hex(key)
    cipherText = sodium.crypto_aead_chacha20poly1305_encrypt(input,null,null,nonce, key)
    return sodium.to_hex(cipherText)
}

/**
 * aead_chacha20poly1305_decrypt
 * @param key : string hex lengh 64
 * @param nonce : string hex lengh 16
 * @param cipherText : string hex
 * @param sodium
 * @returns {*}
 */
function aead_chacha20poly1305_decrypt(key,nonce,cipherText,sodium) {
    var nonce = sodium.from_hex(nonce)
    key = sodium.from_hex(key)
    cipherText = sodium.from_hex(cipherText)

    text = sodium.crypto_aead_chacha20poly1305_decrypt(null,cipherText,null,nonce, key)
    return sodium.to_string(text)
}

/* ca_con. */
var ca_con = {
    Identity : 'HuyTiep',
    s        : bignum('56989941998462347672987602550999533264770353479858321356565325701217730703612'),
    P        : bignum('294111635673278162351154176014102396387625451979036227419125313074038381658941'),
    r        : bignum('65953422206312113839999244405625316636764932831125838515716619672179387746801'),
    b        : bignum('93455158518568526477967417058158654555909885525887231482938808192906219294124'),
    B        : bignum('160525881502485434026879635433951019388458014395473238246856144097602432343671')
}

/* trang dang ky IC*/
router.get('/dkyIC',helper.isLoggedIn, function(req, res, next) {
    var user  = req.user.user
    var thongtin = req.user.thongtin
    var url = helper.fullUrl(req,'')
    res.render('user/dky_IC',{Identity : ca_con.Identity,user:user,url:url,thongtin:thongtin});
});


/*Dang ky*/
router.post('/dkyIC',helper.isLoggedIn, function(req, res, next) {
    var id      = req.body.id
    var date    = req.body.date
    // console.log(date)
    var ca      = req.body.ca
    var R       = (req.body.R)
    var hash = crypto.createHash('sha256');
    var mes_hash = hash.update(id+date).digest().toString('hex')
    var id_new = mes_hash
    // R = ecc.make_public_key(r).public_key
    R = bignum(R)
    var C = ecc.make_public_key(ca_con.b).public_key
    var cert  = ecc.create_cert(id_new,R,ca_con.b,C)
    req.session.cert = {
        P   :cert.P.toString(),
        id  :cert.id,
        s   :cert.s.toString()
    }
    req.session.save(function(err) {
        res.json(true)
    })
});


/*trang tao khoa bi mat*/
router.get('/taokhoa',helper.isLoggedIn, function(req, res, next) {
    var url = helper.fullUrl(req,'')
    var cert = (req.session.cert)
    var user  = req.user.user
    var thongtin = req.user.thongtin
    res.render('user/taokhoa',{IC  : cert.P,s:cert.s,user:user,url:url,thongtin:thongtin});

});


/*tao khoa bi mat ma hoa va gui qua mail,aead_chacha20poly1305
* key = hash_256(r)*/
router.post('/taokhoa',helper.isLoggedIn, function(req, res, next) {
    var cert = (req.session.cert)
    var r    = (req.body.r)
    var private_key_ca = ca_con.B
    var user = req.user
    r = bignum(r)

    cert = {
        P   :bignum(cert.P),
        id  :cert.id,
        s   :bignum(cert.s)
    }
    var key = ecc.create_key_to_cert(r,private_key_ca,cert)
    var private_key = key[0].toString()
    var data = {
        IC_ca : ca_con.P.toString(),
        private_key:private_key,
        IC:cert.P.toString()
    }
    data = JSON.stringify(data)
    var nonce = sodium.to_hex(sodium.randombytes_buf(8))
    var hash = crypto.createHash('sha256');
    var key = hash.update(r.toString()).digest().toString('hex')
    data = (aead_chacha20poly1305_encrypt(key,nonce,data,sodium))
    var text =  'Giải mã bằng thuật toán aead_chacha20poly1305 tham khảo thu viện libsodium\n' +
                'Key là giá trị hash_256 của r\n' +
                'nonce = '+nonce;
    model.update_user_IC(cert.P.toString(),user.user,function (error,result) {

        if(error==null){
            fs.writeFile('model/file/'+r.toString()+'.text',data,function (error,result) {
                if(error==null){
                    send_mail.send_file(user.user,'Khóa bí mật','model/file/'+r.toString()+'.text',text,function (error,response) {
                        if (response){
                            fs.unlink('model/file/'+r.toString()+'.text', function (error,result) {
                            })
                        }
                    })
                }
            })
        }
    })
    res.json(true)
});


module.exports = router;
