var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var pdf = require('html-pdf');
var fs = require('fs');

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

function PrintPDF(vid, selection, election) {
    var html = "Vote by " + vid + " for " + selection;
    var options = { format: 'Letter' };
    
    var dir = './pdfs/'+election+'/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    
    pdf.create(html, options).toFile(dir+vid+'.pdf', function(err, res) {
        if (err) return console.log(err);
            console.log(res); 
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
    socket.on('vote',function(data){
        PrintPDF(data.id, data.selection, data.election);
    });
});

server.listen(process.env.PORT || 3000, function(){
  console.log('listening on '+(process.env.PORT || 3000));
});