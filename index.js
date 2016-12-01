var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
const crypto = require('crypto');
const secret = 'hsdufaophap';

var nodemailer = require('nodemailer');

function SendVID(vid, email) {
  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'PorcelainSandDollar@gmail.com', // Your email id
          pass: 'p@ssword' // Your password
      }
    });
    //var vid = '0000000000';
    var text = 'Your voter ID is ' + vid;
    //var email = "timothy.linhardt@gmail.com";
    var mailOptions = {
      from: 'PorcelainSandDollar@gmail', // sender address
      to: email, // list of receivers
      subject: 'Voter ID', // Subject line
      text: text //, // plaintext body
    };
    transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    };
  });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log("connected.");
    socket.on('send email',function(data){
      SendVID(data.id, data.email);
    });
});

server.listen(process.env.PORT || 3000, function(){
  console.log('listening on '+(process.env.PORT || 3000));
});