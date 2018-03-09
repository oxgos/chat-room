const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var count = 0;

io.on('connection', function(socket) {
    count++;
    io.emit('chat num', count);
    var username = socket.handshake.query.username;
    io.emit('resBroad', username + '进入聊天室');
    socket.on('sendMsg', function (data) {
        socket.emit('resMsg', '我: ' + data);
        // 当前socket发出的广播,自己不会显示
        socket.broadcast.emit('resBroad', username + ': ' + data);
    })
    socket.on('disconnect', function() {
        count--;
        io.emit('chat num', count);
        // 发出全局广播，自己也会显示
        io.emit('resBroad', username + '离开聊天室');
    })
});

http.listen(3000, function() {
    console.log('listening on *: 3000')
});