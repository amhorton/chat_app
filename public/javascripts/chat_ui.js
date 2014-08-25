$(document).ready(function () {

  var socket = io();

  socket.on('message', function(event) {
    $(".messages").append("<li>"+event.text+"</li>");
  });

  var ourChat = new ChatApp.Chat(socket);

  $('.new-message-form').on('submit', function(event) {
    event.preventDefault()
    var message = $(event.currentTarget).serializeJSON().to_send;
    ourChat.sendMessage(message);
    $(event.currentTarget)[0].reset();
  })


});