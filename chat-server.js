console.log("Server started");

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 2609});

var clients = [];
var usernames = [];
var sessions = [];
wss.on('connection', function(ws) {
    clients.push(ws);
    ws.send(JSON.stringify({'type': 'userlist', 'users': usernames, 'IDs': sessions}));
    ws.on('message', function(message) {
        var _packet = JSON.parse(message);
        if (sessions.indexOf(_packet.ID) == -1) {
            sessions.push(_packet.ID);
            usernames.push(_packet.username);
            broadcast();
        }
        console.log('%s: %s', _packet.username, _packet.message);
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].readyState != clients[0].OPEN) {
                console.error('Client state is ' + clients[i].readyState);
            } else {
                clients[i].send(message);
            }
        }
    });
});

function broadcast() {
//    console.log(usernames);
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].readyState != clients[0].OPEN) {
            console.error('Client state is ' + clients[i].readyState);
        } else {
            clients[i].send(JSON.stringify({'type': 'userlist', 'users': usernames, 'IDs': sessions}));
        }
    }
}