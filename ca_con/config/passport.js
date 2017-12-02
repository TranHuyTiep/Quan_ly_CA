/**
 * Created by Huy Tiep on 4/2/2017.
 */
var  connection  =  require('./db')
var LocalStrategy   = require('passport-local').Strategy;
var help = require('../help/help')

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    //  du lieu user duoc gan vao session neu xac thu thanh cong
    //du lieu duc lay tu  passport.authenticate
    passport.serializeUser(function(user, done) {
        done(null, user[0].user);
    });

    // sau khi dang nhap nó se láy dữ liệu từ sesion rồi gắn vào req.user
    passport.deserializeUser(function(user, done) {
        var query = 'SELECT * FROM user WHERE user =?';
        connection.query(query,user,function(err,rows){
            done(err, rows[0]);
        });

    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({                                 //tao kich ban local login
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',                                                //du lieu duoc gan tu req.body.post
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form
            var query = 'SELECT * FROM user WHERE user =?';
            connection.query(query,email,function (error,result) {
                if(result.length==1){
                    if(help.validPassword(password,result[0].password)){
                        return done(error, result);
                    }else {
                        return done(error);
                    }
                }
                return done(error);
            })


        }));

};