var _ = require('underscore');

var createChat = function(server) {

  var guestnumber = 1;
  var nicknames = {};

  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {
    guestnumber++;
    var myGuestNumber = guestnumber
    var nickname = "guest_"+guestnumber;

    nicknames[guestnumber] = nickname;

    var processCommand = function(command, commandParams) {
      if(command === "nick") {
        var oldName = validateNick(commandParams)
        if (oldName) {
          io.sockets.emit('nameChange', {
            oldName: oldName,
            newName: nicknames[myGuestNumber]
          });
        }
      }
    };

    var validateNick = function (nick) {
      var oldName = nicknames[myGuestNumber]
      if (nick.slice(0, 5) === "guest") {
        return false
      } else if (_.values(nicknames).indexOf(nick) !== -1) {
        return false
      }

      nicknames[myGuestNumber] = nick;
      return oldName
    };

    socket.on('message', function(data) {
      if(data.text[0] === "/") {
        var firstSpace = data.text.indexOf(" ")
        var command = data.text.slice(1, firstSpace);
        var commandParams = data.text.slice(firstSpace + 1)
        processCommand(command, commandParams);
      } else {
        data['nickname'] = nicknames[myGuestNumber];
        io.sockets.emit('message', data);
      }
    });
  });

};





exports.createChat = createChat;

