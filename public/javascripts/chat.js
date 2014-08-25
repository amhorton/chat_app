(function() {
  if(!window.ChatApp) {
    window.ChatApp = {};
  }

  Chat = window.ChatApp.Chat = function(socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function(message) {
    this.socket.emit('message', {
      text: message
      // username: 'sample_username'
    });
  };
})();



