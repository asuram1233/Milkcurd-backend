var channels = {};

module.exports = function (io) {
    'use strict';
    io.sockets.on('connection', function (socket) {
        console.log("New Connection")
        var initiatorChannel = '';
        if (!io.isConnected) {
            io.isConnected = true;
        }
    
        socket.on('new-channel', function (data) {
            console.log(data)
            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
            }
    
            channels[data.channel] = data.channel;
            onNewNamespace(data.channel, data.sender);
        });
    
        socket.on('presence', function (channel) {
            var isChannelPresent = !!channels[channel];
            socket.emit('presence', isChannelPresent);
        });
    
        socket.on('disconnect', function (channel) {
            if (initiatorChannel) {
                delete channels[initiatorChannel];
            }
        });
    });
    
    function onNewNamespace(channel, sender) {
        io.of('/' + channel).on('connection', function (socket) {
            var username;
            if (io.isConnected) {
                io.isConnected = false;
                socket.emit('connect', true);
            }
    
            socket.on('message', function (data) {
                if (data.sender == sender) {
                    if (!username) username = data.data.sender;
    
                    socket.broadcast.emit('message', data.data);
                }
            });
    
            socket.on('disconnect', function () {
                if (username) {
                    socket.broadcast.emit('user-left', username);
                    username = null;
                }
            });
        });
    }    
};
