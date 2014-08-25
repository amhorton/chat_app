var createChat = function(server) {

  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {
    socket.on('message', function(data) {
      socket.emit('message', data);
    });
  });
}

exports.createChat = createChat;

