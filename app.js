var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/assets', express.static(__dirname + '/assets'));

var fs = require('fs');

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection', function (socket) {
  socket.on('move', function (data) {
    console.log(data);
    socket.emit('clientReceive', {message: "server received your move"});
  });
});
