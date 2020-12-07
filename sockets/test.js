
exports = module.exports = function(io){
    io.sockets.on('connection', function (socket) {
      socket.on('test', function () {
        socket.emit('ditConsumer', "hahahah");
        console.log('testEvent triggered--------------------------------------------------------------------------------');
      });
    });
  }