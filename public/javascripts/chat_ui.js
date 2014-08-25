$(document).ready(function () {

  var socket = io();

  socket.on('message', function(event) {
    $(".messages").append(
      "<li>"+ event.nickname + ": " + event.text + "</li>"
    );
  });

  socket.on('nameChange', function(event) {
    $(".messages").append(
      "<li><i>"+ event.oldName + " changed name to " + event.newName + "</i></li>"
    );
  });

  var ourChat = new ChatApp.Chat(socket);

  $('.new-message-form').on('submit', function(event) {
    event.preventDefault()
    var message = $(event.currentTarget).serializeJSON().to_send;
    ourChat.sendMessage(message);
    $(event.currentTarget)[0].reset();
  });


});