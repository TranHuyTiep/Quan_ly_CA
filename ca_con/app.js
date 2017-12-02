var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');


var db_users = require('./model/list_ca')
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/user/login')
var sign_up = require('./routes/user/sign_up')
var dky_ic = require('./routes/IC/dky_IC')
var change_password = require('./routes/user/change_password')
var forgot_password = require('./routes/user/forgot_pass')
var app = express();

app.use(session({
    secret : "huytiep",
    saveUninitialized: true,
    resave: true,
    name: 'HuyTiep',
    // cookie: {
    //     httpOnly: true,
    //     secure: true
    // }
}))



app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', [index,login]);
app.use('/user', [users,forgot_password,sign_up,dky_ic,change_password]);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;


var io = require('socket.io-client');
var socket = io.connect('http://localhost:3003', {reconnect: true});

// Add a connect listenera
socket.on('listCA', function (data) {
  // console.log(data.array)
  db_users.check_exist(data.Identity).then((value) => {  
      if(value.length == 0){
        db_users.insert_listCA(data).then((vale)=>{
            console.log(vale)
          })
      }
  }).catch(err => {
      console.error(err);
  })
});

socket.on('delete', function (data) {
  // console.log(data.array)
  db_users.check_exist(data.Identity).then((value) => {  
    if(value.length == 1){
      db_users.delete_ca(data.Identity).then((vale)=>{
          console.log(vale)
        })
    }
  }).catch(err => {
      console.error(err);
  })
});