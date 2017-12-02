var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var db = require('./model/db')

var index = require('./routes/index');
var users = require('./routes/users');
var ca = require('./routes/CA/CA');
var login = require('./routes/Login/login');

var app = express();


var io = ca.io
io.sockets.on('connection', function(socket)
{
  db.get_All(function(erro,data){
    var array = [];
    data.forEach(function(item){
      // array.push({'Identity':item.Identity})
      socket.emit('listCA', {'Identity':item.Identity});
    })
    
  })
  
});

//set cookie
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

app.use('/', [index,ca,login]);
app.use('/users', users);

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




