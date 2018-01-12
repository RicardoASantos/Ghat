var express = require('express');
var app = express();
var socket = require('socket.io');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var stickyScroll = require('vue-sticky-bottom-scroll');


// Set Port
app.set('port', (process.env.PORT || 3000));

var server = app.listen(app.set('port'),  function(){
	console.log('Server started on port '+app.get('port'));
});

//Connect Database
mongoose.connect('mongodb://localhost/chat');

var db = mongoose.connection;

mongoose.connect('mongodb://localhost/chat', { useMongoClient: true }, function(err){
  if(err){
    console.log(err);
  } else{
    console.log('Connected to Mongo');
  }
});

var chatSchema = mongoose.Schema({
  user: String,
  msg: String,
	room: String,
  created: {type: Date, default: Date.now}
});

var Chat = mongoose.model('Message', chatSchema);

//Socket setup
var io = socket(server);
/*
io.on('connection',function(socket){
  console.log('Made socket connection', socket.id);

  //Retrieve old messages
  var query = Chat.find({});
  query.sort('-created').limit(50).exec(function(err, docs){
    if (err) throw err;
    console.log('Sending old messages');
    socket.emit('load old msgs', docs);
  });

  // Send message
  socket.on('send message' , function(data){
    var newMsg = new Chat({msg:data, user: socket.username});
    newMsg.save(function(err){
      if(err) throw err;
      io.sockets.emit('new message' , {msg:data, user: socket.username});
    })
  });

//User is writing a message
  socket.on('typing', function(data){
    socket.broadcast.emit('typing',data);
  });

  //Username
  socket.on('new user' , function(data, callback){
    socket.username = data;
  });

});
*/

//Chat rooms

var roomSchema = mongoose.Schema({
	room_name: String,
	room_id: String,
	created: {type: Date, default: Date.now}
});

var Room = mongoose.model('Room', roomSchema);

io.sockets.on('connection', function (socket) {

		//Retrieve all rooms
		var queryroom = Room.find({});
		queryroom.sort('created').exec(function(err, docs){
			if (err) throw err;
			console.log('Retrieving rooms');
			socket.emit('load rooms', docs);
		});

//Connect to room
	socket.on('join room', function(data, callback){
		this.leave(socket.thisroom);
		socket.thisroom = data;
		socket.join(socket.thisroom);
		console.log('This room is called ', socket.thisroom);

		var query = Chat.find({"room":socket.thisroom});
		query.sort('-created').limit(50).exec(function(err, docs){
			if (err) throw err;
			console.log('Sending old messages');
			socket.emit('load old msgs', docs);
		});

	});

	function updateRooms() {
		let rooms = Object.keys(socket.rooms);
		console.log(rooms);
	}
	//setInterval(updateRooms, 1000);

//New Room
		socket.on('new room name', function(data, callback){
			socket.newroom = data;
			var newRoom = new Room({room_name:socket.newroom, room_id: socket.id});
			newRoom.save(function(err){
				if(err) throw err;
			});

	});

    socket.on('send group message' , function(data){

			console.log('This room is called ', socket.thisroom);
      var newMsg = new Chat({msg:data, user: socket.username, room:socket.thisroom});

      newMsg.save(function(err){
        if(err) throw err;
        io.sockets.in(socket.thisroom).emit('new group message' , {msg:data, user: socket.username});
        console.log('new group message')
      })
    });

		socket.on('old room name', function(data){
			socket.thisroomname = data;
			console.log(socket.thisroomname);
		});

		socket.on('edit room name', function(data){
			socket.newroomname = data;
			console.log(socket.newroomname);
			//Not working
			 //Room.update({room_id:	socket.thisroomname}, {$set:{room_name:socket.newroomname}});
			 //Working
			 db.collection('rooms').update({room_id:	socket.thisroom}, {$set:{room_name:socket.newroomname}});


		});



});

//Routes
var routes = require('./routes/index');
var users = require('./routes/users');
var chat = require('./routes/chat');
var rooms = require('./routes/rooms');


//View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/chat', chat);
app.use('/room', rooms);
