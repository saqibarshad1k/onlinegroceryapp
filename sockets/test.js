
exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {
      socket.on('test', function () {
        console.log('testEvent triggered');
      });
    });
  }