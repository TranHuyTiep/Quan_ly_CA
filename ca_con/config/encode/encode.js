var crypto = require('crypto');
var sodium = require('libsodium-wrappers')
var fs = require("fs")
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

var nonce = '88cf4d0cad0b9a19'
var hash = crypto.createHash('sha256');
var r = fs.readFileSync('Ca_con/r.txt').toString();
var key = hash.update(r).digest().toString('hex')
var cipherText = fs.readFileSync('Ca_con/private_key.txt').toString();
console.log(aead_chacha20poly1305_decrypt(key,nonce,cipherText,sodium))