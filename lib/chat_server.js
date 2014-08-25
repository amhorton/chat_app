var _ = require('underscore');

var createChat = function(server) {

  var io = require('socket.io').listen(server);

  var guestnumber = 1;
  var nicknames = {};
  var rooms = ["lobby"];



  io.sockets.on('connection', function(socket) {
    guestnumber++;

    var nickname = "guest_"+guestnumber;
    nicknames[socket.id] = nickname;

    var processCommand = function(command, commandParams) {
      if(command === "nick") {
        var oldName = validateNick(commandParams)
        if (oldName) {
          io.sockets.emit('nameChange', {
            oldName: oldName,
            newName: nicknames[socket.id]
          });
        }
      }
      else if(command === "join") {
        joinRoom(commandParams);
      }
    };

    var generateRoomList = function () {
      var roomsAndMembers = {};
      rooms.forEach(function (room) {
        roomsAndMembers[room] = io.sockets.adapter.rooms[room];
      });

      return roomsAndMembers
    }

    socket.leave(_.last(socket.rooms), function() {
      socket.join('lobby', function() {
        io.sockets.emit("updateRooms", generateRoomList());
      });
    });


    var validateNick = function (nick) {
      var oldName = nicknames[socket.id]
      if (nick.slice(0, 5) === "guest") {
        return false
      } else if (_.values(nicknames).indexOf(nick) !== -1) {
        return false
      }

      nicknames[socket.id] = nick;
      io.sockets.emit("updateRooms", generateRoomList());
      return oldName
    };

    var joinRoom = function(room) {
      socket.leave(_.last(socket.rooms));
      socket.join(room, function() {
        if (rooms.indexOf(room) === -1) {
          rooms.push(room);
        }
        io.sockets.emit("updateRooms", generateRoomList());
      });
    }

    socket.on('message', function(data) {
      if(data.text[0] === "/") {
        var firstSpace = data.text.indexOf(" ")
        var command = data.text.slice(1, firstSpace);
        var commandParams = data.text.slice(firstSpace + 1)
        processCommand(command, commandParams);
      } else {
        data['nickname'] = nicknames[socket.id];
        data['roomName'] = _.last(socket.rooms)
        io.sockets.in(_.last(socket.rooms)).emit('message', data)
      }
    });
  });

};





exports.createChat = createChat;

