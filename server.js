/* MongoDB - mongoose */
require('./models/mongodb');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');


const loginController = require('./routes/loginController');
const mainController = require('./routes/mainController');

const hostname = '127.0.0.1';
const port = 3000;


users = [];
connections = [];
const locationMap = new Map;
var visitors = {};

server.listen(port, hostname, () => console.log(`The app listening on port at http://${hostname}:${port}/ `))

io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log('Connected : %s sockets connected', connections.length);

	socket.on('new_user', function(data){
		// if(parseInt(Object.keys(visitors).length) > 0)
    // 	socket.emit('already', {visitors: visitors});

    visitors[socket.id] = data.pos;
  
    io.sockets.emit('connected', { pos: visitors[socket.id], users_count: Object.keys(visitors).length, users: Object.keys(visitors) });
		console.log('someone CONNECTED:');
		console.log(Object.keys(visitors).length);
	});

  socket.on("sendMessage", function(data){
    io.sockets.emit('sendMessage', {msg : data});
    console.log("send message func " + data);
  })

  //Disconnect
  socket.on("disconnect", function(data){
    connections.splice(connections.indexOf(socket),1);
    console.log('Disconnected : %s sockets connected', connections.length);
    console.log(visitors);
    if(visitors[socket.id]){
			var todel = visitors[socket.id];
			delete visitors[socket.id];
			io.sockets.emit('disconnected', { del: todel, users_count: Object.keys(visitors).length }); 	
		}

  })
});

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var expressWs = require('express-ws')(app);

// set the default views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// register the bodyParser middleware for processing forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', loginController);
// app.use('/main', mainController);


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