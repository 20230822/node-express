var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

var mainRouter = require('./src/routes/main/main');
var userRouter = require('./src/routes/user/user');
var myRouter = require('./src/routes/mypage/my');
var productRouter = require('./src/routes/product/product');

// var usersRouter = require('./routes/users');

var app = express();



// // view engine setup
// app.set('views', path.join(__dirname,'src', 'views'));
// app.set('view engine', 'ejs');

// app.set('views', path.join(__dirname, 'public', 'views'));
// app.set('view engine', 'njk');
// nunjucks.configure('views', { 
//   express: app,
//   watch: true,
// });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin : process.env.SERVER_HOST,
  methods : ['GET', 'POST', 'PUT', 'DELETE'],
  credentials : true //쿠키 사용
}));

app.use(express.static(path.join(__dirname, 'src/public/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true,
})); // url을 통해 전달되는 데이터에 한글, 공백곽 같은 문자가 포함 될경우 제대로 인식하지 않는 문제 해결
app.use(bodyParser.raw({ type: 'image/*' }));

app.use('/api/main', mainRouter);
app.use('/api', userRouter);
app.use('/api/mypage', myRouter);
app.use('/api/product', productRouter);
// app.use('/users', usersRouter);

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
