
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const initPassport = require('./utils/passport.config')
const indexRouter = require('./routes/index');
const tracksRouter = require('./routes/tracks/index');
const uploadRouter = require('./routes/tracks/upload');
const usersRouter = require('./routes/users/index');
const testRouter = require('./routes/test');
const authRouter = require('./routes/auth');
const payRouter = require('./routes/pay');
const searchRouter = require('./routes/search');
const orderRouter = require('./routes/order');
const videoRouter = require('./routes/video');
const mailRouter = require('./routes/mail');
const { default: mongoose } = require('mongoose');
const passport = require("passport")
const session = require("express-session");
const multer = require('multer');
const cors = require('cors');


const app = express();
require("dotenv").config()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

/* --------------- PASSPORT -----------------------*/
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
initPassport(passport)
/* --------------- END PASSPORT -----------------------*/
/*------------------ mongodb ----------------------- */
async function connectMongo(){
  let mongoURL = process.env.MONGO_URL
  try {
    await mongoose.connect(mongoURL);
    console.log('Connection established');
  }
  catch(e) {
    console.log('Could not establish connection')
   console.log(e); 
  }
}
connectMongo()
/*------------------ End mongodb ----------------------- */
const parser = multer().none() // for req.body
app.use('/', indexRouter);
app.use('/users', parser, usersRouter);
app.use('/test', testRouter); 
app.use('/auth', parser, authRouter);
app.use('/tracks', tracksRouter);
app.use('/mail', mailRouter);
app.use('/pay',payRouter);
app.use('/search',searchRouter);
app.use('/video',videoRouter);
app.use('/order', parser, orderRouter);
//app.use('/tracks/upload', uploadRouter);

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
