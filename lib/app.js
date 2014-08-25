var http = require('http');
var static = require('node-static');
var socketio = require('socket.io');
var createChat = require('./chat_server.js').createChat;


var file = new static.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

server.listen(8000);
console.log("listenin' on localhost 8000");

createChat(server);