var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jade = require('jade');
var multer = require('multer');

var indexRouter = require('./routes/index');
var companyDetailsRouter = require('./routes/companyDetails');
var companyMainRouter = require('./routes/companyMainDetails');
var companyVotingRouter = require('./routes/companyVotingDetails');
var companyQuestionRouter = require('./routes/companyQuestionDetails');
var candidateDetailRouter = require('./routes/candidateDetails');
var liveVotingRouter = require('./routes/liveVoting');
var mongoose = require('mongoose');

// const CompanyDetails = require('./models/companyDetails');

const url = 'mongodb://localhost:27017/CompanyDetail';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


var app = express();


var passport            = require("passport"),
LocalStrategy           = require("passport-local").Strategy;

var User = require('./models/users');
var CompanyDetails = require('./models/companyDetails');
var passportLocalMongoose     = require("passport-local-mongoose");


// var User = mongoose.model("manasusers" , Users);

app.use(require("express-session")({
    secret: "once again GOOGLE wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));



      
// User.plugin(passportLocalMongoose);
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy({
  usernameField: 'email'
},
function(username, password, done) {
    CompanyDetails.findOne({ companyEmail: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.companyPassword!=password) { return done(null, false); }
      return done(null, user);
    });
  }
));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
}); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));
// app.use( express.static( "views" ) );/

app.use('/', indexRouter);

// app.use('/users', usersRouter);

app.use('/companyDetails', companyDetailsRouter);



app.use('/c', companyMainRouter);
app.use('/voting', companyVotingRouter);
app.use('/question', companyQuestionRouter);
app.use('/candidate', candidateDetailRouter);
app.use('/s', liveVotingRouter);

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
  // res.json("PageNotExits")
  res.status(err.status || 500);
  res.render('error');
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/c/default/login");
}

module.exports = app;
