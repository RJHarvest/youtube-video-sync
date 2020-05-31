const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 5000;

const usernames = [];
let currentVideoId = 'L9ro1KjkJMg';

// For static files
app.use(express.static(path.join(__dirname, 'public')));

// Ejs view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// server.listen(process.env.PORT || 5000);
// console.log('server is running');

// GET index.ejs
app.get('/', (req, res)=>{
  // res.sendFile(__dirname + '/index.html');
  res.render('index');
});

io.sockets.on('connection', (socket)=>{
  console.log('Socket connected...');

  socket.on('new user', function(data, callback){
    if (usernames.indexOf(data) != -1) {
      return callback(false);
    }
    callback(currentVideoId);
    socket.username = data;
    usernames.push(socket.username);
    updateUsernames();
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
    io.sockets.emit('event', msg);
  });

  socket.on('new video', function(url){
    currentVideoId = url.split('=')[1]
    io.sockets.emit('load video', currentVideoId);
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
