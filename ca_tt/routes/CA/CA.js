var ecc = require('../ECC/ECC')
var express = require('express');
var fs = require('fs')
var router = express.Router();
var bignum = require('bignum');
var db = require('../../model/db');
var send_mail = require('../../help/send_mail');
var crypto = require('crypto');
var helper = require('../../help/help')
var io = require('socket.io');
io = io.listen(3003);
var sodium = require('libsodium-wrappers')



var CA = { private_key: bignum('82113988649868749038536556381039178581735922864762864577138058550951916871801'),
            public_key: bignum('952088166760366280905719430296332950941513814007895129239977479325330082369440')}


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


/* GET users listing. */
router.get('/taoCAcon',helper.isLoggedIn, function(req, res, next) {
    res.render('taoCA');
});


/**
 * tao CA con
 */
router.post('/taoCAcon',helper.isLoggedIn, function(req, res, next) {
    var param = req.body
    var r = param.r
    var R = bignum(param.R)
    var id = param.id
    var thongtin = param.thongtin
    var email = param.email
    var cert = ecc.create_cert(id,R,CA.private_key,CA.public_key)
    var key_ca = ecc.create_key_to_cert(bignum(param.r),CA.public_key,cert)
   
    var data = {
        Identity : id,
        // b        : key_ca.b,
        IC       : cert.P,
        thong_tin: thongtin,
        radom_number:R
    }
    db.check_exist_user(id,function (err,result) {
        if(result.length==0){
            db.insert_ca(data,function (err,result) {

                io.sockets.on('connection', function(socket)
                {
                  socket.emit('add', { Identity:id});
                });

                var cert_string = {
                    P:cert.P.toString(),
                    id:cert.id,
                    s:cert.s.toString()
                }
                
                if(result){
                    var data_mail = JSON.stringify(cert_string)
                    var nonce = sodium.to_hex(sodium.randombytes_buf(8))
                    var hash = crypto.createHash('sha256');
                    var key = hash.update(r.toString()).digest().toString('hex')
                    var data_send = (aead_chacha20poly1305_encrypt(key,nonce,data_mail,sodium))
                    var text =  'Giải mã bằng thuật toán aead_chacha20poly1305 tham khảo thu viện libsodium\n' +
                                'Key là giá trị hash_256 của r\n' +
                                'nonce = '+nonce;
                 
                    fs.writeFile('model/file/'+r.toString()+'.text',data_send,function (error,result) {
                        if(error==null){
                            send_mail.send_file(email,'Chứng chỉ số ','model/file/'+r.toString()+'.text',text,function (error,response) {
                                if (response){
                                    fs.unlink('model/file/'+r.toString()+'.text', function (error,result) {
                                        })
                                    }
                                })
                            }
                        })
                    res.json(true)
                }
            })
        }else{
            res.json({user:'exist'})
        }
    })
    
});


/* GET  list Ca. */
router.get('/listCa',helper.isLoggedIn, function(req, res, next) {
    db.get_All(function (error,result) {
        if(result){
            res.render('list_CA',{data:result});
        }
    })
});



router.post('/delete',helper.isLoggedIn,function (req,res,next) {
    var param = req.body
    var id = param.id

    // Add a connect listener
    io.sockets.on('connection', function(socket)
    {
      socket.emit('delete', { Identity:id});
    });
    if(id){
        db.delete_id(id,function (error,result) {
            if(result){
                res.json({id:id})
            }
        })
    } 
    
})
// var r  = bignum ('87262345530922577443228001065370089012784097922453117227630613113734005054219')
// var hash = crypto.createHash('sha256');
// var key = hash.update('87262345530922577443228001065370089012784097922453117227630613113734005054219').digest().toString('hex')
// var cert = (aead_chacha20poly1305_decrypt(key,'a6ae29e5cc52b828','649237241cbc2da570fc0429e9bb4fc5b12c9645d21339ca1e98985774d662faa4efdb4a0b75a3ed84413395bd4c1759181bfc75c3a7c60476a5903f32d0dd9914a197b1aa3969c55ac67f9e2258dff9a4b0102319dbda0a4b3e26bc5d7eee0a75df5cc45d7a0056e5c1f2dff0a42bf339b900e98159479bebb9e429e2abd1cc324d296383ad16c30a7b2c58134d840f1dbd45792c318a21e089e7f6dbb44ec1e08c2e65df68c08cb3f2f0ec751fba0b80dd00d65efb36ee2404d8772962434cc366a6dc346e7132735039',sodium))
// cert = JSON.parse(cert)
// console.log(cert)
// console.log(ecc.create_key_to_cert(r,CA.public_key,cert))

module.exports = router;
module.exports.io = io
