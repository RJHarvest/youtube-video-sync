const express = require('express');
const ejs = require('ejs');
const path = require('path');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
const port = process.env.PORT || 5000;

var usernames = [];

// For static files
app.use(express.static(path.join(__dirname, 'public')));

// Ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// GET index.ejs
app.get('/', (req, res)=>{
  res.render('index.html');
});

io.sockets.on('connection', (socket)=>{
  console.log('Socket connected...');

  socket.on('new user', function(data, callback){
    if(usernames.indexOf(data) != -1){
      callback(false);
    }else{
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  // Update usernames
  function updateUsernames(){
    io.sockets.emit('usernames', usernames);
  }

  // Send message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  // Video events (play and pause video)
  socket.on('video event', function(msg){
    console.log(msg);
    io.sockets.emit('event', msg);
  });

  // Disconnect
  socket.on('disconnect', function(data){
    if(!socket.username){
      return;
    }

    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });
});

// Run server
server.listen(port, ()=>{
  console.log(`Server is running on port ${port}`);
});
