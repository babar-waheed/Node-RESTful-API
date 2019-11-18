const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');
const cors = require('cors');

const indexRouter = require('./routes/index');  
const usersRouter = require('./routes/users');
const feedRouter = require('./routes/feed'); 
const authRouter = require('./routes/auth');

const app = express();    
//app.use(cors())

//Image handling using multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname); 
  }
})
//Image handling using multer
const fileFilter = (req, file, cb) => {
   if(file.mimetype === 'image/png'
   || file.mimetype === 'image/jpg'
   || file.mimetype === 'image/jpeg'){
     cb(null, true)
   }else{
     cb(null, false)
   }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());   
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//Image handling using multer
app.use(
  multer({storage: fileStorage, fileFilter: fileFilter}).single('image') //only for input that has name=image;
);


app.use((req, res, next) => {
  console.log("[Setting Response Headers]");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Origin, Authorization');
  next();  
});

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter); 
app.use('/feed', feedRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler 
app.use(function(req, res, next) { 
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  console.log("INSIDE ERROR HANDLER");
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : err.message;

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: res.locals.error
  });
});

module.exports = app;
