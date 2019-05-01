const createError = require('http-errors');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const State = mongoose.model('State', {
  stateName: String,
  mode: String,
  minTemp: Number,
  maxTemp: Number,
  manualTemp: Number,
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/**
 * Router dependencies.
 */
const api = require('./api/states');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/states', api(State, io));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Added DB connections.
 */

const dbUrl = 'mongodb://batler12:qwerty22@ds135776.mlab.com:35776/apidb';

mongoose.connect(dbUrl, { useNewUrlParser: true }, () => {
  try {
    console.log('mongodb connected');
  } catch (err) {
    console.error(err)
  }
})

io.on('connection', () => {
  console.log('user is connected: ');
})

/**
 * Start server on 3000 port
 */

const server = http.listen(process.env.PORT || 3000, () => {
  try {
    console.log('server is running on port', server.address().port);
  } catch (err) {
    console.error(err);
  }
});
