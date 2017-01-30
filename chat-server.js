var config = require('./config/config.js');
var u = require('./lib/user.js');

console.log("Server started");

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: config.WebServerSocketPort});

var redis = require('redis');

var channels = {};

var subscriber = redis.createClient();

var publisher = redis.createClient();


var user = new u();

wss.on('connection', function(ws) {
    subscriber.subscribe('global');
    /*
     * Messages will be send from websocket
     **/

    subscriber.on('message', function(channel, message) {
        ws.send(message, function(err) {
            if (err !== null) {
                console.log('error: %s', err);
            }
        });
    });
    /*
     * Messages will be recieved on websocket
     **/
    ws.on('message', function(message) {
        _packet = JSON.parse(message);
        switch (_packet.type) {
            case 'userlist':
                break;
            case 'useronline' :
                user.addUser(_packet.ID, {'username': _packet.ID, 'client': subscriber, 'ws': ws});
                allUsers = user.getAllUserNameAndID();
                publisher.publish('global', JSON.stringify({'type': 'userlist', 'users': allUsers}));
                break;
            case 'groupchat' :
                publisher.publish('global', message);
                break;
            case 'init121chat' :
                subscriber.subscribe('121chat');
                break;
            case '121chat' :
                break;
            case 'setname' :
                user.setUserName(_packet.ID, _packet.username);
                allUsers = user.getAllUserNameAndID();
                publisher.publish('global', JSON.stringify({'type': 'userlist', 'users': allUsers}));
                break;
            case 'starttyping':
                publisher.publish('global', JSON.stringify({'type': 'starttyping', 'userid': _packet.ID, 'username': _packet.username}));
                break;
            case 'endtyping':
                publisher.publish('global', JSON.stringify({'type': 'endtyping', 'userid': _packet.ID, 'username': _packet.username}));
                break;
        }
    });
    ws.on('disconnect', function() {
        subscriber.quit();
    });
});