var express = require('express');
var router = express.Router();
var passport = require('passport')
var helper = require('../../help/help')
/* GET home page. */
router.get('/login',helper.check_login, function(req, res, next) {
    var url = helper.fullUrl(req,'')
    res.render('login',{url:url});
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/user/dkyic', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error

}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
