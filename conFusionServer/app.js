var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');


const mongoose = require('mongoose');


const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require ('./models/leaders')

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url); 

connect.then((db) => {
	console.log('Connected correctly to server');

},(err) => {console.log(err); });
//.catch((err) =>console.log("WTF",err));
 
//,(err) => {console.log(err); });

 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321')); /*The digits are the secret key which can be used by cookie
 parser to encrypt the information and signed the cookie that has been send from the server to the client */




 /**                           THIS IS BASIC AUTHENCTICATION   
  * 
 //We will add authentication here right before client access the server
 //All middlewares comes after this can be acessed after the authentication is complete

function auth(req,res,next) {
  console.log(req.headers);

  var authHeader = req.headers.authorization;

  if(!authHeader) {
    var err = new Error('You are not Authenticated Mr.');

    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401;
    next(err); //Now it will send error to ERROR HANDLER
  }
  //We are now splitting the AuthorizationHeader with space
  //Converting string literal into Base64 endcode
  //From this we will extract the username and Password
  //Now a array is formed,First element contains basic
  //Second element  contains Base64 encoded string.
  //We will use second element of Array
  //We have converted that second element to String
  //We have again split the String to Username and Password using (:)
  var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
  //Now auth is an array which contains username and Password which is extracted from base64

  var username = auth[0];
  var password = auth[1];

  if(username === 'admin'  && password === 'password') {
    
    //Now if username and password is correct we can move on to next middleware using next();
    next();
  }
  else {
    var err = new Error('You are not Authenticated');

    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401;
    return next(err);
  }

}
*/


//We will add authentication here right before client access the server
 //All middlewares comes after this can be acessed after the authentication is complete

 function auth(req,res,next) {
  console.log(req.signedCookies);

  //User will be a property that we will set up in the signed cookie 
  // if the incoming request does not include the user field in the signed cookies, and then that means that the user has not been authorized yet.
  //So in that case, what we will do is expect the user to authenticate himself.
  if(!req.signedCookies.user) {

   
    var authHeader = req.headers.authorization;

  if(!authHeader) {
    var err = new Error('You are not Authenticated Mr.');

    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401;
    next(err); //Now it will send error to ERROR HANDLER
  }
  //We are now splitting the AuthorizationHeader with space
  //Converting string literal into Base64 endcode
  //From this we will extract the username and Password
  //Now a array is formed,First element contains basic
  //Second element  contains Base64 encoded string.
  //We will use second element of Array
  //We have converted that second element to String
  //We have again split the String to Username and Password using (:)
  var auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
  //Now auth is an array which contains username and Password which is extracted from base64

  var username = auth[0];
  var password = auth[1];

  if(username === 'admin'  && password === 'password') {
    
    //Now if username and password is correct we can move on to next middleware using next();
    
    /**Notice that the cookie doesn't exist, so we'll say "res.cookie."
     * As you can see, the res cookie itself takes the first value name string, value string 
     * and options, cookie options.So we'll say, "res.cookie" and then I'm going to set up
     *  the cookie with the name user. Now notice that this is the reason why I am checking for 
     * the req.signedCookies.user up there. So we'll say "res.cookie('user',)" and the user field
     *  I will set it to 'admin' and then I will set this up to be a signed cookie. So I will say 
     * "signed: true." So which means that my cookie-parser will ensure that this cookie will be 
     * signed and setup. So this is the option that I set up for the res cookie here. So this will 
     * include this particular name into the signed cookie with this particular value. So that is
     *  the reason why I'm able to check that value up here. So if this doesn't exist, then of 
     * course I expect the user to authenticate by using the basic authentication, and if the 
     * basic authentication is successful, then I will set up the cookie here and set up the
     *  cookie field in the outgoing response message here and this will prompt the client to 
     * set up the cookie on the client side and then all subsequent requests will include this
     *  cookie in the client request. */
    

     
    res.cookie('user','admin',{signed: true})
    next();
  }
  else {
    var err = new Error('You are not Authenticated');

    res.setHeader('WWW-Authenticate','Basic');
    err.status = 401;
    return next(err);
  }

  }

  /**So that is how I am handling the fact when the cookie.user doesn't exist. There. If it exists, then the else part, so that means that the signed cookie already exists and the user property is defined on that, then in the else, what I will check is if req.signedCookies.user is admin. Then, that means that the signed cookie contains the correct information. Then, I will say next. So which means that you will allow the request to pass through. */
  else {
      if(req.signedCookies.user === 'admin') {

        next();
      }
      /**Otherwise, this cookie is not valid because it doesn't contain this correct value. So that means that this is an error.  */
      else {
        var err = new Error('You are not Authenticated');
        
        err.status = 401;
        return next(err);

      }

  }
  

}



app.use(auth); 


 
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
