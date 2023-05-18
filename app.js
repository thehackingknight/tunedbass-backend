const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const initPassport = require('./utils/passport.config')
const indexRouter = require('./routes/index');
const tracksRouter = require('./routes/tracks/index');
const uploadRouter = require('./routes/tracks/upload');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/test');
const authRouter = require('./routes/auth');
const { default: mongoose } = require('mongoose');
const passport = require("passport")
const session = require("express-session");
const multer = require('multer');
const cors = require('cors');


const app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
/* --------------- PASSPORT -----------------------*/
app.use(session({
  secret: "marindatomatotorindata",
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
initPassport(passport)
/* --------------- END PASSPORT -----------------------*/
/*------------------ mongodb ----------------------- */
async function connectMongo(){
  let mongoURL = false ? "mongodb+srv://clickbait4587:baseline072@cluster0.qwyyk.mongodb.net/tubar" : "mongodb://127.0.0.1:27017/tubar";
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

app.use('/', multer().none(), indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);
app.use('/auth', authRouter);
app.use('/tracks', tracksRouter);
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
