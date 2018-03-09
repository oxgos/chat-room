const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// 统计聊天室人数
var count = 0;

io.on('connection', function(socket) {
    // 有进入用户加1
    count++;
    // 返回数据给前台
    io.emit('chat num', count);
    // 获取前台传来的query参数
    var username = socket.handshake.query.username;
    // 全局广播信息
    io.emit('resBroad', username + '进入聊天室');
    // 接收前台发送来的信息
    socket.on('sendMsg', function (data) {
        // 回复信息到前台
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
