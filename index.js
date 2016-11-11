var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log("connected.");
});
//changed from 3000 so cloud9 works
server.listen(process.env.PORT || 3000, function(){
  console.log('listening on '+(process.env.PORT || 3000));
});