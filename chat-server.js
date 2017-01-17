console.log("Server started");
var config = require('./config/config.js');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: config.WebServerSocketPort});

var redis = require('redis');

var channels = {};
var users = {};

var subscriber = redis.createClient();

var publisher = redis.createClient();

wss.on('connection', function(ws) {
    subscriber.subscribe('global');

    /*
     * Messages will be send from websocket
     **/

    subscriber.on('message', function(channel, message) {
        ws.send(message);
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
                users[_packet.ID] = {'username': _packet.ID, 'client': subscriber, 'ws': ws};
                var allUsers = getAllUserNameAndID();
                publisher.publish('global', JSON.stringify({'type': 'userlist', 'users': allUsers}));
                break;
            case 'groupchat' :
                publisher.publish('global', message);
                break;
            case 'init121chat' :
                createChannel(_packet);
                break;
            case '121chat' :
                break;
            case 'setname' :
                setUserName(_packet.ID, _packet.username);
                break;
        }
    });
    ws.on('disconnect', function() {
        subscriber.quit();
    });
});

function createChannel(_packet) {
    subscriber.subscribe(_packet.message);
    bothusers = _packet.message.split("-");
    var secondSubscriber = getRedisSubscriberByID(bothusers[1]);
    secondSubscriber.subscribe(_packet.message);
//    console.log(bothusers);
}

function getRedisSubscriberByID(userid) {
    for (var key in users) {
        if (key === userid) {
            return users[key]['client'];
        }
    }
    return -1;
}

function getAllUserNameAndID() {
    var allUsers = [];
    for (var key in users) {
//        console.log(key + ": " + users[key]['ws']);
        allUsers.push({'userid': key, 'username': users[key]['username']});// = 
    }
    return allUsers;
}

function findUserByName(name) {
    for (var i = 0; i < usernames.length; i++) {
        if (usernames[i] === name) {
            return i;
        }
    }
    return -1;
}

function findUserByID(ID) {
    for (var i = 0; i < subscribers.length; i++) {
        if (subscribers[i] === ID) {
            return i;
        }
    }
    return -1;
}

function setUserName(userid, username) {
    for (var key in users) {
        if (key === userid) {
            users[key]['username'] = username;
        }
    }
    var allUsers = getAllUserNameAndID();
    publisher.publish('global', JSON.stringify({'type': 'userlist', 'users': allUsers}));
//    console.log(users);
}
