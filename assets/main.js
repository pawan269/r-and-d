/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var chat_server = new WebSocket("ws://10.2.42.98:2609");
//var chat_server = new WebSocket("ws://localhost:2609");
var whotyping = [];

chat_server.onopen = function(event) {
    var _packet = {
        'type': 'useronline',
        'ID': sess_id,
        'username': $("#username").val(),
        'message': ''
    };
    chat_server.send(JSON.stringify(_packet));
    $("#input").focus();
};

chat_server.onmessage = function(event) {
    var _packet = JSON.parse(event.data);
    switch (_packet.type) {
        case 'groupchat' :
            addMessage(_packet.username, _packet.message);
            break;
        case 'userlist' :
            addUserList(_packet.users);
            break;
        case 'useronline' :
            addUserList(_packet.users);
            break;
        case 'starttyping':
            if (whotyping.indexOf(_packet.username) === -1) {
                whotyping.push(_packet.username);
            }
            setIsTyping();
            break;
        case 'endtyping':
            var index = whotyping.indexOf(_packet.username);
            whotyping.splice(index, 1);
            setIsTyping();
            break;
    }

    $("#input").focus();
    scroll();
};

function setIsTyping() {
    var str = whotyping.join();
    if (whotyping.length === 0) {
        $('#istyping').html('');
        return true;
    } else if (whotyping.length === 1) {
        str += ' is typing';
        $('#istyping').html(str);
        return true;
    } else {
        str += ' are typing';
        $('#istyping').html(str);
        return true;
    }
}

function sendMessage() {
    txt = $("#input").val();
    if (jQuery.trim(txt) === '')
        return false;
    var _packet = {
        'type': 'groupchat',
        'ID': sess_id,
        'username': $("#username").val(),
        'message': $("#input").val()
    };
    chat_server.send(JSON.stringify(_packet));
    $("#input").val('');
    $("#input").focus();
    scroll();
    _packet = {
        'type': 'endtyping',
        'ID': sess_id,
        'username': $("#username").val(),
        'message': ''
    };
    chat_server.send(JSON.stringify(_packet));
    clearTimeout(flag);
}
;

function scroll() {
    var elem = document.getElementById('content');
    elem.scrollTop = elem.scrollHeight;
}
;

function addMessage(username, message) {
    $("#content").append('<ul><li><b>' + username + '</b>: ' + message + '</li></ul>');
}

function addUserList(users) {
//                console.log(users);
    $("#userlist").html('');
    for (var i = 0; i < users.length; i++) {
        $("#userlist").append('<div class="userlistrow" onclick="selectUser(\'' + users[i]['userid'] + '\', \'' + users[i]['username'] + '\')">' + users[i]['username'] + '</div>');
//                    console.log(users[i]);
    }
}

function selectUser(sessionid, user) {
    if (sessionid === sess_id) {
        alert('you can not chat with youself!');
    } else {
        $('#popup_box').fadeIn("slow");
        $("#chat-title").html("Chat with " + user);
        var _packet = {
            'type': 'init121chat',
            'ID': sess_id,
            'username': $("#username").val(),
            'to_ID': sessionid,
            'to_username': user,
            'message': sess_id + '-' + sessionid
        };
        chat_server.send(JSON.stringify(_packet));
    }
}

function setName() {
    var _packet = {
        'type': 'setname',
        'ID': sess_id,
        'username': $("#username").val(),
        'message': ''
    };
    chat_server.send(JSON.stringify(_packet));
}

function reduceTimer() {
    timer = timer - 1;
    setTyping(true, -1);
}

var flag;

function setTyping(val, event) {
    if (event.keyCode === 13) {
        sendMessage();
        return false;
    }
    if (val === 1) {
        timer = 5;
        var _packet = {
            'type': 'starttyping',
            'ID': sess_id,
            'username': $("#username").val(),
            'message': ''
        };
        chat_server.send(JSON.stringify(_packet));
        clearTimeout(flag);
    } else {
        if (timer <= 0) {
            _packet = {
                'type': 'endtyping',
                'ID': sess_id,
                'username': $("#username").val(),
                'message': ''
            };
            chat_server.send(JSON.stringify(_packet));
            clearTimeout(flag);
            timer = 5;
        } else {
            clearTimeout(flag);
            flag = setTimeout(reduceTimer, 1000);
        }
    }
}